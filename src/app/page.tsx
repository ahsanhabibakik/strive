import { Newsletter } from "@/components/forms/Newsletter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Strive
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          A comprehensive Next.js template with authentication, blog, newsletter, and essential components ready to use.
        </p>
        <div className="space-x-4">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">Learn More</Button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🚀 Fast Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Next.js 15, TypeScript, and Tailwind CSS pre-configured for rapid development.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🔐 Auth Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              NextAuth.js with Google OAuth and credentials authentication built-in.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📝 Content System</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Blog and newsletter functionality with MongoDB storage included.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Newsletter */}
      <div className="max-w-2xl mx-auto">
        <Newsletter />
      </div>
    </div>
  );
}