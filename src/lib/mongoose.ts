import mongoose from "mongoose";
import { logger } from "./monitoring";

// Forward declarations to avoid circular dependencies
interface DatabaseHealthMonitor {
  start(): void;
  stop(): void;
  getHealthStats(): any;
}

interface DatabaseMetrics {
  start(): void;
  stop(): void;
  getMetrics(): any;
}

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    healthMonitor?: DatabaseHealthMonitor;
    metrics?: DatabaseMetrics;
  };
}

interface ConnectionConfig {
  uri: string;
  readReplicas?: string[];
  writeReplicas?: string[];
  options: mongoose.ConnectOptions;
}

interface DatabaseConfig {
  primary: ConnectionConfig;
  replica?: ConnectionConfig;
  maxRetries: number;
  retryInterval: number;
  healthCheckInterval: number;
  poolConfig: {
    maxPoolSize: number;
    minPoolSize: number;
    maxIdleTimeMS: number;
    waitQueueTimeoutMS: number;
    serverSelectionTimeoutMS: number;
  };
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_READ_URI = process.env.MONGODB_READ_URI || MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV || "development";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Advanced database configuration
const dbConfig: DatabaseConfig = {
  primary: {
    uri: MONGODB_URI,
    readReplicas: MONGODB_READ_URI ? MONGODB_READ_URI.split(",") : undefined,
    writeReplicas: MONGODB_URI ? [MONGODB_URI] : [],
    options: {
      // Connection pooling optimization
      maxPoolSize: NODE_ENV === "production" ? 50 : 10,
      minPoolSize: NODE_ENV === "production" ? 5 : 2,
      maxIdleTimeMS: 30000, // 30 seconds
      waitQueueTimeoutMS: 10000, // 10 seconds
      serverSelectionTimeoutMS: 10000, // 10 seconds

      // Connection management
      bufferCommands: false,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,

      // Replica set configuration
      readPreference: "primaryPreferred",
      readConcern: { level: "majority" },
      writeConcern: { w: "majority", j: true, wtimeout: 10000 },

      // Heartbeat and monitoring
      heartbeatFrequencyMS: 10000,

      // Compression
      compressors: ["zlib"],

      // Retry logic
      retryWrites: true,
      retryReads: true,
    },
  },
  maxRetries: 5,
  retryInterval: 1000,
  healthCheckInterval: 30000, // 30 seconds
  poolConfig: {
    maxPoolSize: NODE_ENV === "production" ? 50 : 10,
    minPoolSize: NODE_ENV === "production" ? 5 : 2,
    maxIdleTimeMS: 30000,
    waitQueueTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
  },
};

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
    healthMonitor: undefined,
    metrics: undefined,
  };
}

// Connection pool metrics tracking
class ConnectionPoolMonitor {
  private static instance: ConnectionPoolMonitor;
  private metrics: Map<string, any> = new Map();

  static getInstance(): ConnectionPoolMonitor {
    if (!ConnectionPoolMonitor.instance) {
      ConnectionPoolMonitor.instance = new ConnectionPoolMonitor();
    }
    return ConnectionPoolMonitor.instance;
  }

  trackConnection(event: string, data: any = {}) {
    const timestamp = new Date().toISOString();
    const key = `${event}_${timestamp}`;

    this.metrics.set(key, {
      event,
      timestamp,
      ...data,
    });

    // Keep only last 1000 metrics
    if (this.metrics.size > 1000) {
      const oldestKey = this.metrics.keys().next().value;
      this.metrics.delete(oldestKey);
    }

    logger.debug(`Connection pool event: ${event}`, data);
  }

  getMetrics(): Array<any> {
    return Array.from(this.metrics.values());
  }

  getConnectionStats() {
    const now = Date.now();
    const recentMetrics = this.getMetrics().filter(
      m => now - new Date(m.timestamp).getTime() < 300000 // last 5 minutes
    );

    return {
      totalEvents: recentMetrics.length,
      connectionAttempts: recentMetrics.filter(m => m.event === "connecting").length,
      connectionSuccesses: recentMetrics.filter(m => m.event === "connected").length,
      connectionErrors: recentMetrics.filter(m => m.event === "error").length,
      disconnections: recentMetrics.filter(m => m.event === "disconnected").length,
      reconnections: recentMetrics.filter(m => m.event === "reconnected").length,
    };
  }
}

// Enhanced connection function with retry logic and monitoring
export async function connectToDatabase(retryCount = 0): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const poolMonitor = ConnectionPoolMonitor.getInstance();

    cached.promise = connectWithRetry(dbConfig, poolMonitor, retryCount)
      .then(mongoose => {
        logger.info("Successfully connected to MongoDB", {
          poolSize: dbConfig.poolConfig.maxPoolSize,
          environment: NODE_ENV,
        });

        // Health monitoring and metrics are initialized separately
        // through the DatabaseOptimizationSuite to avoid circular dependencies

        return mongoose;
      })
      .catch(error => {
        logger.error("MongoDB connection failed after all retries:", error, {
          retryCount,
          maxRetries: dbConfig.maxRetries,
        });
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Connection with exponential backoff retry logic
async function connectWithRetry(
  config: DatabaseConfig,
  poolMonitor: ConnectionPoolMonitor,
  retryCount = 0
): Promise<typeof mongoose> {
  try {
    poolMonitor.trackConnection("connecting", { retryCount });

    // Setup connection event listeners
    mongoose.connection.on("connecting", () => {
      poolMonitor.trackConnection("connecting");
      logger.debug("Connecting to MongoDB...");
    });

    mongoose.connection.on("connected", () => {
      poolMonitor.trackConnection("connected");
      logger.info("Connected to MongoDB");
    });

    mongoose.connection.on("disconnected", () => {
      poolMonitor.trackConnection("disconnected");
      logger.warn("Disconnected from MongoDB");
    });

    mongoose.connection.on("reconnected", () => {
      poolMonitor.trackConnection("reconnected");
      logger.info("Reconnected to MongoDB");
    });

    mongoose.connection.on("error", error => {
      poolMonitor.trackConnection("error", { error: error.message });
      logger.error("MongoDB connection error:", error);
    });

    mongoose.connection.on("close", () => {
      poolMonitor.trackConnection("close");
      logger.warn("MongoDB connection closed");
    });

    const result = await mongoose.connect(config.primary.uri, config.primary.options);
    poolMonitor.trackConnection("success", { retryCount });

    return result;
  } catch (error) {
    poolMonitor.trackConnection("error", { error: (error as Error).message, retryCount });

    if (retryCount < config.maxRetries) {
      const delay = config.retryInterval * Math.pow(2, retryCount); // Exponential backoff
      logger.warn(
        `MongoDB connection failed, retrying in ${delay}ms (attempt ${retryCount + 1}/${config.maxRetries})`,
        error
      );

      await new Promise(resolve => setTimeout(resolve, delay));
      return connectWithRetry(config, poolMonitor, retryCount + 1);
    }

    throw error;
  }
}

// Get connection pool statistics
export function getConnectionPoolStats() {
  const poolMonitor = ConnectionPoolMonitor.getInstance();
  return {
    ...poolMonitor.getConnectionStats(),
    currentConnections: mongoose.connection.readyState,
    poolSize: {
      configured: dbConfig.poolConfig.maxPoolSize,
      min: dbConfig.poolConfig.minPoolSize,
    },
    database: mongoose.connection.db?.databaseName,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
  };
}

// Get database health status
export function getDatabaseHealth() {
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    database: mongoose.connection.db?.databaseName,
    // Detailed stats are available through DatabaseOptimizationSuite
  };
}

// Graceful shutdown
export async function disconnectFromDatabase(): Promise<void> {
  try {
    // Monitoring components are managed by DatabaseOptimizationSuite

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      logger.info("Disconnected from MongoDB");
    }

    cached.conn = null;
    cached.promise = null;
  } catch (error) {
    logger.error("Error during database disconnect:", error);
    throw error;
  }
}

// Force reconnection
export async function reconnectToDatabase(): Promise<typeof mongoose> {
  await disconnectFromDatabase();
  return connectToDatabase();
}

export { mongoose, dbConfig };
export default connectToDatabase;
