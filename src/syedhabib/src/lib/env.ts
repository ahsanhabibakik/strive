// Server-side environment variables
const serverEnv = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
} as const;

// Public (client-side) environment variables
export const publicEnv = {
  NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Type-safe environment variable access
export function getEnvVariable(key: keyof typeof serverEnv): string {
  // In browser, we can't access server env vars
  if (typeof window !== 'undefined') {
    throw new Error(`getEnvVariable('${key}') should not be called on the client side`);
  }
  
  const value = serverEnv[key];
  if (!value && key !== 'NODE_ENV') {
    console.error(`❌ Environment variable ${key} is not set`);
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

// Export server environment with type safety
export const env = new Proxy(serverEnv, {
  get(target, prop: string) {
    return getEnvVariable(prop as keyof typeof serverEnv);
  },
}) as typeof serverEnv;
