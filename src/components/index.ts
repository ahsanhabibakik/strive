// UI Components - Reusable across any project
export { Button } from "./ui/button";
export { Input } from "./ui/input";
export { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";

// Forms - Universal form components
export { Newsletter } from "./forms/Newsletter";

// Layout Components - Adaptable layout components
export { Navbar } from "./layout/Navbar";

// Providers - Context and state management
export { Providers } from "./providers/Providers";

// Types for components
export interface NewsletterProps {
  onSubscribe?: (email: string) => Promise<void>;
  className?: string;
  title?: string;
  description?: string;
  buttonText?: string;
}

export interface NavbarProps {
  brand?: string;
  links?: Array<{ href: string; label: string }>;
  authEnabled?: boolean;
  className?: string;
}