import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import crypto from 'crypto';
import connectToDatabase from '../mongoose';
import { User, IUser } from '../models/User';
import { ApiKey } from '../models/ApiKey';
import { logger } from '../monitoring';

export interface AuthenticatedRequest extends NextRequest {
  user?: IUser;
  apiKey?: {
    id: string;
    userId: string;
    permissions: string[];
  };
}

/**
 * Authentication middleware for API routes
 */
export async function authenticateRequest(request: NextRequest): Promise<{
  authenticated: boolean;
  user?: IUser;
  apiKey?: any;
  error?: string;
}> {
  try {
    await connectToDatabase();

    // Check for API key in headers
    const apiKeyHeader = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (apiKeyHeader && apiKeyHeader.startsWith('sk_')) {
      return await authenticateApiKey(apiKeyHeader);
    }

    // Check for session token
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (token?.email) {
      const user = await User.findOne({ email: token.email }).select('+password');
      if (user && user.isActive) {
        // Update last activity
        user.lastLoginAt = new Date();
        await user.save();
        
        return {
          authenticated: true,
          user
        };
      }
    }

    return {
      authenticated: false,
      error: 'Invalid or expired authentication'
    };

  } catch (error) {
    logger.error('Authentication error:', error as Error);
    return {
      authenticated: false,
      error: 'Authentication failed'
    };
  }
}

/**
 * Authenticate using API key
 */
async function authenticateApiKey(apiKey: string) {
  try {
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
    
    const keyDoc = await ApiKey.findOne({
      hashedKey,
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    }).populate('userId');

    if (!keyDoc) {
      return {
        authenticated: false,
        error: 'Invalid API key'
      };
    }

    // Update usage
    keyDoc.lastUsed = new Date();
    keyDoc.usageCount += 1;
    await keyDoc.save();

    const user = await User.findById(keyDoc.userId);
    if (!user || !user.isActive) {
      return {
        authenticated: false,
        error: 'Associated user not found or inactive'
      };
    }

    return {
      authenticated: true,
      user,
      apiKey: {
        id: keyDoc._id,
        userId: keyDoc.userId,
        permissions: keyDoc.permissions
      }
    };

  } catch (error) {
    logger.error('API key authentication error:', error as Error);
    return {
      authenticated: false,
      error: 'API key authentication failed'
    };
  }
}

/**
 * Require authentication middleware
 */
export function requireAuth(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const auth = await authenticateRequest(request);
    
    if (!auth.authenticated) {
      return NextResponse.json(
        { error: auth.error || 'Authentication required' },
        { status: 401 }
      );
    }

    // Add user to request
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = auth.user;
    authenticatedRequest.apiKey = auth.apiKey;

    return handler(authenticatedRequest);
  };
}

/**
 * Require specific role
 */
export function requireRole(roles: string | string[]) {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  
  return function (handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
    return requireAuth(async (request: AuthenticatedRequest) => {
      const user = request.user!;
      
      if (!roleArray.includes(user.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      return handler(request);
    });
  };
}

/**
 * Require specific permissions (for API keys)
 */
export function requirePermission(permissions: string | string[]) {
  const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
  
  return function (handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
    return requireAuth(async (request: AuthenticatedRequest) => {
      const { user, apiKey } = request;
      
      // If authenticated via session, check user role
      if (!apiKey) {
        if (user?.role === 'admin') return handler(request);
        
        return NextResponse.json(
          { error: 'API key required for this operation' },
          { status: 403 }
        );
      }

      // Check API key permissions
      const hasPermission = permissionArray.some(permission => 
        apiKey.permissions.includes(permission) || apiKey.permissions.includes('admin')
      );

      if (!hasPermission) {
        return NextResponse.json(
          { error: 'Insufficient API key permissions' },
          { status: 403 }
        );
      }

      return handler(request);
    });
  };
}

/**
 * Optional authentication - doesn't fail if not authenticated
 */
export function optionalAuth(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const auth = await authenticateRequest(request);
    
    const authenticatedRequest = request as AuthenticatedRequest;
    if (auth.authenticated) {
      authenticatedRequest.user = auth.user;
      authenticatedRequest.apiKey = auth.apiKey;
    }

    return handler(authenticatedRequest);
  };
}

/**
 * Rate limiting middleware
 */
export function rateLimit(options: {
  windowMs: number;
  max: number;
  keyGenerator?: (request: NextRequest) => string;
}) {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return function (handler: (request: NextRequest) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
      const key = options.keyGenerator ? 
        options.keyGenerator(request) : 
        request.ip || 'anonymous';
      
      const now = Date.now();
      const windowStart = now - options.windowMs;
      
      const requestData = requests.get(key);
      
      if (!requestData || requestData.resetTime < windowStart) {
        requests.set(key, { count: 1, resetTime: now + options.windowMs });
        return handler(request);
      }
      
      if (requestData.count >= options.max) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': options.max.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(requestData.resetTime).toISOString()
            }
          }
        );
      }
      
      requestData.count++;
      requests.set(key, requestData);
      
      const response = await handler(request);
      response.headers.set('X-RateLimit-Limit', options.max.toString());
      response.headers.set('X-RateLimit-Remaining', (options.max - requestData.count).toString());
      response.headers.set('X-RateLimit-Reset', new Date(requestData.resetTime).toISOString());
      
      return response;
    };
  };
}