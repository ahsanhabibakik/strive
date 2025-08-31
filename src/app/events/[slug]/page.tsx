import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { EventDetailPage } from "@/components/events/EventDetailPage";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Load event data for metadata
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/data/events.json`
    );
    const data = await response.json();
    const event = data.events.find((e: any) => e.slug === params.slug);

    if (!event) {
      return {
        title: "Event Not Found - Strive",
      };
    }

    return {
      title: `${event.title} - Strive`,
      description: event.description,
      keywords: event.tags.join(", "),
    };
  } catch (error) {
    return {
      title: "Event Details - Strive",
    };
  }
}

export default async function EventDetail({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/auth/signin?callbackUrl=/events/${params.slug}`);
  }

  // Load event data
  let event = null;
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/data/events.json`,
      {
        cache: "no-store",
      }
    );
    const data = await response.json();
    event = data.events.find((e: any) => e.slug === params.slug);
  } catch (error) {
    // Fallback for local development
    const fs = await import("fs");
    const path = await import("path");
    try {
      const filePath = path.join(process.cwd(), "src/data/events.json");
      const fileContent = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(fileContent);
      event = data.events.find((e: any) => e.slug === params.slug);
    } catch (fsError) {
      console.error("Failed to load events data:", error, fsError);
    }
  }

  if (!event) {
    notFound();
  }

  return <EventDetailPage event={event} user={session.user} />;
}
