"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";

export default function TestPage() {
  const { data: session } = useSession();
  const [tests, setTests] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const runTest = useCallback(async (testName: string, url: string) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      setTests(prev => ({
        ...prev,
        [testName]: {
          status: response.ok ? "success" : "error",
          data,
          timestamp: new Date().toISOString(),
        },
      }));
    } catch (error) {
      setTests(prev => ({
        ...prev,
        [testName]: {
          status: "error",
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        },
      }));
    }
    setLoading(false);
  }, []);

  const testNewsletter = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "test@example.com" }),
      });
      const data = await response.json();
      setTests(prev => ({
        ...prev,
        newsletter: {
          status: response.ok ? "success" : "error",
          data,
          timestamp: new Date().toISOString(),
        },
      }));
    } catch (error) {
      setTests(prev => ({
        ...prev,
        newsletter: {
          status: "error",
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        },
      }));
    }
    setLoading(false);
  }, []);

  const runAllTests = useCallback(async () => {
    await runTest("health", "/api/health");
    await runTest("blog", "/api/blog");
    await testNewsletter();
  }, [runTest, testNewsletter]);

  useEffect(() => {
    runAllTests();
  }, [runAllTests]);

  const TestResult = ({ name, result }: { name: string; result: any }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              result?.status === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Status:{" "}
            <span className={result?.status === "success" ? "text-green-600" : "text-red-600"}>
              {result?.status}
            </span>
          </p>
          {result?.timestamp && (
            <p className="text-xs text-gray-500">
              Tested: {new Date(result.timestamp).toLocaleString()}
            </p>
          )}
          {result?.data && (
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-700">View Response</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded-sm text-xs overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </details>
          )}
          {result?.error && <p className="text-red-600 text-sm">Error: {result.error}</p>}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">API Test Dashboard</h1>
        <p className="text-gray-600 mb-4">Test all the API endpoints and functionality</p>
        <Button onClick={runAllTests} disabled={loading}>
          {loading ? "Testing..." : "Run All Tests"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">API Tests</h2>
          {tests.health && <TestResult name="Health Check" result={tests.health} />}
          {tests.blog && <TestResult name="Blog API" result={tests.blog} />}
          {tests.newsletter && <TestResult name="Newsletter API" result={tests.newsletter} />}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${session ? "bg-green-500" : "bg-yellow-500"}`}
                />
                Auth Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {session ? (
                <div>
                  <p className="text-green-600 text-sm">Authenticated</p>
                  <p className="text-xs text-gray-600 mt-1">User: {session.user?.email}</p>
                  <p className="text-xs text-gray-600">
                    Name: {session.user?.name || "Not provided"}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-yellow-600 text-sm">Not authenticated</p>
                  <p className="text-xs text-gray-600 mt-1">
                    <a href="/auth/signin" className="text-blue-600 hover:underline">
                      Sign in to test authentication
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Environment Check</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>MongoDB URI:</span>
                  <span
                    className={
                      process.env.NEXT_PUBLIC_MONGODB_URI ? "text-green-600" : "text-red-600"
                    }
                  >
                    {process.env.NEXT_PUBLIC_MONGODB_URI ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>NextAuth Secret:</span>
                  <span className={process.env.NEXTAUTH_SECRET ? "text-green-600" : "text-red-600"}>
                    {process.env.NEXTAUTH_SECRET ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sanity Project ID:</span>
                  <span
                    className={
                      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? "✓" : "Optional"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-x-2">
            <Button onClick={() => runTest("health", "/api/health")} size="sm">
              Test Health
            </Button>
            <Button onClick={() => runTest("blog", "/api/blog")} size="sm">
              Test Blog API
            </Button>
            <Button onClick={testNewsletter} size="sm">
              Test Newsletter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
