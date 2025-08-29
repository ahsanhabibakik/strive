import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import { User } from '@/lib/models/User';
import { RBAC } from '@/lib/rbac';

// Mock API Keys storage - same reference as in the main route
let apiKeys: any[] = [];

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ keyId: string }> }
) {
  const params = await context.params;
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
    if (!RBAC.hasPermission(user, 'api-keys:delete')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const keyId = params.keyId;
    
    // Find the API key
    const keyIndex = apiKeys.findIndex(key => key.id === keyId);
    
    if (keyIndex === -1) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    const apiKey = apiKeys[keyIndex];
    
    // Verify the key belongs to the user
    if (apiKey.userId !== user._id) {
      return NextResponse.json(
        { error: 'Unauthorized access to API key' },
        { status: 403 }
      );
    }

    // Remove the API key
    apiKeys.splice(keyIndex, 1);

    return NextResponse.json({
      message: 'API key deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ keyId: string }> }
) {
  const params = await context.params;
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

    const keyId = params.keyId;
    const body = await req.json();
    const { name, permissions, isActive } = body;
    
    // Find the API key
    const keyIndex = apiKeys.findIndex(key => key.id === keyId);
    
    if (keyIndex === -1) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    const apiKey = apiKeys[keyIndex];
    
    // Verify the key belongs to the user
    if (apiKey.userId !== user._id) {
      return NextResponse.json(
        { error: 'Unauthorized access to API key' },
        { status: 403 }
      );
    }

    // Update the API key
    if (name !== undefined) apiKey.name = name;
    if (permissions !== undefined) apiKey.permissions = permissions;
    if (isActive !== undefined) apiKey.isActive = isActive;

    return NextResponse.json({
      message: 'API key updated successfully',
      apiKey: {
        ...apiKey,
        key: '***hidden***' // Don't expose the key in updates
      }
    });

  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}