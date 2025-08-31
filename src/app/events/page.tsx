import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { EventsPage } from "@/components/events/EventsPage";

export const metadata = {
  title: "Events - Strive",
  description:
    "Discover upcoming conferences, hackathons, and networking events to boost your career and skills.",
  keywords: "events, conferences, hackathons, networking, career development, professional growth",
};

export default async function Events() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/events");
  }

  return <EventsPage user={session.user} />;
}
