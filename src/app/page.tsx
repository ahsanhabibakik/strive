import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Hero } from "@/components/landing/Hero";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Strive - Achieve Your Goals Together",
  description:
    "A powerful platform to help you set, track, and achieve your personal and professional goals. Stay motivated and organized with our comprehensive goal management system.",
  keywords:
    "goal tracking, productivity, achievement, personal development, goal setting, progress tracking, motivation, success planning, habit formation, life goals",
};

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  // Redirect authenticated users to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Footer />
    </div>
  );
}
