import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CommunityPage } from "@/components/community/CommunityPage";

export const metadata = {
  title: "Community - Strive",
  description:
    "Connect with like-minded individuals, share experiences, and get advice from professionals in your field.",
  keywords:
    "community, networking, career advice, professional discussions, goal sharing, mentorship",
};

export default async function Community() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/community");
  }

  return <CommunityPage user={session.user} />;
}
