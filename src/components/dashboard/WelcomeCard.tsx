import Image from "next/image";
import { IUser } from "@/lib/models/User";
import { RBAC } from "@/lib/rbac";
import { formatRelativeTime } from "@/lib/utils";

interface WelcomeCardProps {
  user: IUser;
}

export function WelcomeCard({ user }: WelcomeCardProps) {
  const userRole = RBAC.getUserRole(user);
  const now = new Date();
  const hour = now.getHours();

  const getGreeting = () => {
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 text-white shadow-lg">
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {getGreeting()}, {user.name}!
            </h1>
            <p className="mt-2 text-indigo-100">Welcome back to your dashboard</p>

            <div className="mt-4 flex items-center gap-4 text-sm text-indigo-100">
              <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                {userRole?.name || user.role}
              </span>

              {user.subscription?.plan !== "free" && (
                <span className="inline-flex items-center rounded-md bg-green-500/20 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                  {user.subscription?.plan} Plan
                </span>
              )}

              {user.lastLoginAt && (
                <span className="text-xs">Last login: {formatRelativeTime(user.lastLoginAt)}</span>
              )}
            </div>
          </div>

          {/* Decorative elements */}
          <div className="hidden sm:block">
            <div className="relative">
              {user.image ? (
                <Image
                  className="h-16 w-16 rounded-full border-4 border-white/20"
                  src={user.image}
                  alt={user.name || "User avatar"}
                  width={64}
                  height={64}
                />
              ) : (
                <div className="h-16 w-16 rounded-full border-4 border-white/20 bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl font-bold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-10" />
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm" />
      <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5 backdrop-blur-sm" />
    </div>
  );
}
