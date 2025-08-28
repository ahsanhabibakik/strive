import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/auth.config';

export async function isUserAdmin() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin';
}

export async function getCurrentUser() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Authentication required');
  }
  return session;
}

export async function requireAdmin() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return session;
}
