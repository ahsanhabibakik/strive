import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";


// Create MongoDB client with error handling
let client: MongoClient | null = null;
try {
  if (process.env.MONGODB_URI) {
    client = new MongoClient(process.env.MONGODB_URI);
  }
} catch (error) {
  console.warn("MongoDB connection failed:", error);
}

export const authOptions: NextAuthOptions = {
  // Only use MongoDB adapter if we have a valid client
  ...(client && { adapter: MongoDBAdapter(client) }),
  
  providers: [
    // Only include Google provider if credentials are available
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // For development, return a mock user if no MongoDB
        if (!client || !process.env.MONGODB_URI) {
          if (credentials?.email === "test@example.com" && credentials?.password === "password") {
            return {
              id: "1",
              email: "test@example.com",
              name: "Test User",
            };
          }
          return null;
        }

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const db = client.db();
          const user = await db.collection("users").findOne({
            email: credentials.email
          });

          if (!user) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};