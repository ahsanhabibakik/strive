import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongoose-simple";
import Opportunity from "@/lib/models/Opportunity";
import { OpportunityDetailClient } from "@/components/opportunities/OpportunityDetailClient";
import { OpportunityDetailSkeleton } from "@/components/opportunities/OpportunityDetailSkeleton";

interface OpportunityDetailPageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getOpportunity(slug: string) {
  try {
    await connectToDatabase();
    
    // Try to find by slug first, then by ID as fallback
    const opportunity = await Opportunity.findOne({
      $or: [
        { slug: slug },
        { _id: slug }
      ],
      status: "published"
    }).lean();

    if (!opportunity) {
      return null;
    }

    // Increment view count
    await Opportunity.findByIdAndUpdate(opportunity._id, {
      $inc: { viewCount: 1 }
    });

    return JSON.parse(JSON.stringify(opportunity));
  } catch (error) {
    console.error("Error fetching opportunity:", error);
    return null;
  }
}

async function getRelatedOpportunities(currentId: string, category: string, limit = 3) {
  try {
    await connectToDatabase();
    
    const related = await Opportunity.find({
      _id: { $ne: currentId },
      category: category,
      status: "published",
      applicationDeadline: { $gt: new Date() }
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("title slug category organizerName applicationDeadline isOnline country city isFree difficulty viewCount submissionCount logoUrl tags")
    .lean();

    return JSON.parse(JSON.stringify(related));
  } catch (error) {
    console.error("Error fetching related opportunities:", error);
    return [];
  }
}

export default async function OpportunityDetailPage({
  params,
  searchParams,
}: OpportunityDetailPageProps) {
  const opportunity = await getOpportunity(params.slug);

  if (!opportunity) {
    notFound();
  }

  const relatedOpportunities = await getRelatedOpportunities(
    opportunity._id,
    opportunity.category
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<OpportunityDetailSkeleton />}>
          <OpportunityDetailClient
            opportunity={opportunity}
            relatedOpportunities={relatedOpportunities}
            searchParams={searchParams}
          />
        </Suspense>
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: OpportunityDetailPageProps) {
  const opportunity = await getOpportunity(params.slug);

  if (!opportunity) {
    return {
      title: "Opportunity Not Found - Strive",
      description: "The opportunity you're looking for could not be found.",
    };
  }

  const daysUntilDeadline = Math.ceil(
    (new Date(opportunity.applicationDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const deadlineText = daysUntilDeadline > 0 
    ? `Apply by ${new Date(opportunity.applicationDeadline).toLocaleDateString()}`
    : "Application deadline has passed";

  return {
    title: `${opportunity.title} - ${opportunity.organizerName} | Strive`,
    description: `${opportunity.description.substring(0, 155)}... ${deadlineText}`,
    openGraph: {
      title: opportunity.title,
      description: opportunity.description.substring(0, 155),
      images: opportunity.bannerUrl ? [opportunity.bannerUrl] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: opportunity.title,
      description: opportunity.description.substring(0, 155),
      images: opportunity.bannerUrl ? [opportunity.bannerUrl] : [],
    },
    keywords: [
      ...opportunity.tags,
      opportunity.category,
      opportunity.difficulty,
      "opportunity",
      "application",
      opportunity.organizerName,
    ].join(", "),
  };
}