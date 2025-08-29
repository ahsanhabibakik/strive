import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import { User } from '@/lib/models/User';
import { RBAC } from '@/lib/rbac';
import crypto from 'crypto';

// Mock API Key model - In a real app, you'd have a separate model
interface APIKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  prefix: string;
  masked: string;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
  lastUsed?: Date;
  usage: {
    totalRequests: number;
    monthlyRequests: number;
    lastRequest?: Date;
  };
}

// This would normally be stored in a database
const apiKeys: APIKey[] = [];

function generateAPIKey(): { key: string; prefix: string; masked: string } {
  const prefix = 'sk_';
  const randomPart = crypto.randomBytes(32).toString('hex');
  const key = prefix + randomPart;
  const masked = prefix + '****' + randomPart.slice(-4);
  
  return { key, prefix, masked };
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (!RBAC.hasPermission(user, 'api-keys:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Filter API keys for this user
    const userApiKeys = apiKeys.filter(key => key.userId === userId);

    // Remove the actual key from the response for security
    const sanitizedKeys = userApiKeys.map(key => ({
      ...key,
      key: '***hidden***' // Don't send the actual key in GET requests
    }));

    return NextResponse.json({ apiKeys: sanitizedKeys });

  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (!RBAC.hasPermission(user, 'api-keys:write')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, permissions, expiresIn } = body;

    if (!name || !permissions || !Array.isArray(permissions)) {
      return NextResponse.json(
        { error: 'Name and permissions are required' },
        { status: 400 }
      );
    }

    // Generate API key
    const { key, prefix, masked } = generateAPIKey();
    
    // Calculate expiration date
    let expiresAt: Date | undefined;
    if (expiresIn && expiresIn > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresIn);
    }

    const newApiKey: APIKey = {
      id: crypto.randomUUID(),
      userId: user._id,
      name,
      key,
      prefix,
      masked,
      permissions,
      isActive: true,
      createdAt: new Date(),
      expiresAt,
      usage: {
        totalRequests: 0,
        monthlyRequests: 0
      }
    };

    apiKeys.push(newApiKey);

    // Return the key only once during creation
    return NextResponse.json({
      message: 'API key created successfully',
      apiKey: {
        ...newApiKey,
        // Include the actual key only in the creation response
        key: newApiKey.key
      }
    });

  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}