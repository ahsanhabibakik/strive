"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Github, Mail, Loader2, Check, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { showToast } from "@/lib/utils/toast";
import { z } from "zod";

const signUpSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
    acceptTerms: z
      .boolean()
      .refine(val => val === true, "You must accept the terms and conditions"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const { t } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState<SignUpForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<SignUpForm & { submit: string }>>({});

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    Object.values(checks).forEach(check => {
      if (check) strength += 20;
    });

    return { strength, checks };
  };

  const { strength: passwordStrength, checks: passwordChecks } = calculatePasswordStrength(
    formData.password
  );

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 80) return "Good";
    return "Strong";
  };

  const validateForm = () => {
    try {
      signUpSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<SignUpForm & { submit: string }> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            const field = err.path[0] as keyof (SignUpForm & { submit: string });
            (fieldErrors as any)[field] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleInputChange = (field: keyof SignUpForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.field) {
          setErrors({ [data.field]: data.message });
        } else {
          setErrors({ submit: data.message });
        }
        return;
      }

      // Account created successfully
      showToast.success(t("auth.accountCreated"));

      // Auto sign in after successful registration
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Redirect to sign in page if auto sign in fails
        router.push(
          `/auth/signin?message=account-created&email=${encodeURIComponent(formData.email)}`
        );
      } else {
        // Redirect to email verification or dashboard
        router.push("/auth/verify-email");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setErrors({ submit: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error(`${provider} sign up error:`, error);
      showToast.error(`Failed to sign up with ${provider}`);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{t("auth.createAccount")}</CardTitle>
        <CardDescription>Get started with your free account</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {errors.submit && (
          <Alert variant="destructive">
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        {/* OAuth Providers */}
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthSignUp("google")}
            disabled={isLoading}
          >
            <Mail className="w-4 h-4 mr-2" />
            Sign up with Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthSignUp("github")}
            disabled={isLoading}
          >
            <Github className="w-4 h-4 mr-2" />
            Sign up with GitHub
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={e => handleInputChange("firstName", e.target.value)}
                disabled={isLoading}
                className={errors.firstName ? "border-red-500" : ""}
                autoComplete="given-name"
              />
              {errors.firstName && <p className="text-xs text-red-600">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={e => handleInputChange("lastName", e.target.value)}
                disabled={isLoading}
                className={errors.lastName ? "border-red-500" : ""}
                autoComplete="family-name"
              />
              {errors.lastName && <p className="text-xs text-red-600">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={e => handleInputChange("email", e.target.value)}
              disabled={isLoading}
              className={errors.email ? "border-red-500" : ""}
              autoComplete="email"
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={e => handleInputChange("password", e.target.value)}
                disabled={isLoading}
                className={errors.password ? "border-red-500" : ""}
                autoComplete="new-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Password strength:</span>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength < 40
                        ? "text-red-600"
                        : passwordStrength < 80
                          ? "text-yellow-600"
                          : "text-green-600"
                    }`}
                  >
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <Progress
                  value={passwordStrength}
                  className={`h-2 ${getPasswordStrengthColor()}`}
                />

                {/* Password Requirements */}
                <div className="space-y-1">
                  {[
                    { key: "length", text: "At least 8 characters" },
                    { key: "uppercase", text: "One uppercase letter" },
                    { key: "lowercase", text: "One lowercase letter" },
                    { key: "number", text: "One number" },
                    { key: "special", text: "One special character" },
                  ].map(({ key, text }) => (
                    <div key={key} className="flex items-center space-x-2">
                      {passwordChecks[key as keyof typeof passwordChecks] ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <X className="h-3 w-3 text-red-600" />
                      )}
                      <span
                        className={`text-xs ${
                          passwordChecks[key as keyof typeof passwordChecks]
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={e => handleInputChange("confirmPassword", e.target.value)}
                disabled={isLoading}
                className={errors.confirmPassword ? "border-red-500" : ""}
                autoComplete="new-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start space-x-2">
            <input
              id="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={e => handleInputChange("acceptTerms", e.target.checked)}
              className="mt-1 rounded-sm border-gray-300"
              disabled={isLoading}
            />
            <Label htmlFor="acceptTerms" className="text-sm leading-5">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          {errors.acceptTerms && <p className="text-sm text-red-600">{errors.acceptTerms}</p>}

          <Button type="submit" className="w-full" disabled={isLoading || passwordStrength < 80}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t("auth.createAccount")}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="text-center">
        <p className="text-sm text-muted-foreground">
          {t("auth.alreadyHaveAccount")}{" "}
          <Link href="/auth/signin" className="font-medium text-primary hover:underline">
            {t("auth.signIn")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default SignUpForm;
