import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-indigo-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
          <p className="text-gray-600 mb-8">Sorry, we couldn't find the page you're looking for.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">Go back home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact support</Link>
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If you believe this is a mistake, please{" "}
            <Link href="/contact" className="text-indigo-600 hover:text-indigo-500">
              contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
