"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthTest() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          NextAuth Test
        </h1>
        
        {session ? (
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-sm">
              ✅ Authentication is working!
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-2">Signed in as:</p>
              <p className="font-semibold text-gray-900">{session.user?.email}</p>
              {session.user?.name && (
                <p className="text-gray-600">{session.user.name}</p>
              )}
            </div>
            
            <button
              onClick={() => signOut()}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-sm transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-sm">
              ℹ️ Not authenticated
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => signIn("credentials")}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-sm transition-colors duration-200"
              >
                Sign In with Credentials
              </button>
              
              <div className="text-center text-sm text-gray-600">
                <p>Test credentials:</p>
                <p>Email: test@example.com</p>
                <p>Password: password</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500 text-center">
            <p>Status: <span className="font-mono">{status}</span></p>
            <p>NextAuth URL: <span className="font-mono">{process.env.NEXTAUTH_URL || "Not set"}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}