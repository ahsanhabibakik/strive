import { MongoClient, MongoClientOptions } from 'mongodb';
import { env } from './env';

if (!env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

const uri = env.MONGODB_URI;
const options: MongoClientOptions = {
  // Add any MongoDB options here
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Initialize the client outside the conditional
const client = new MongoClient(uri, options);
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the connection across module reloads.
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  // We know _mongoClientPromise is defined here because we just set it above if it wasn't
  clientPromise = global._mongoClientPromise || client.connect();
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
