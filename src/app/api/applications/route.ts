import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose-simple";
import Application from "@/lib/models/Application";
import Opportunity from "@/lib/models/Opportunity";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { opportunityId, responses, submittedAt } = body;

    if (!opportunityId || !responses) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    // Verify opportunity exists and is still accepting applications
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    if (new Date(opportunity.applicationDeadline) < new Date()) {
      return NextResponse.json({ error: "Application deadline has passed" }, { status: 400 });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      opportunityId,
      userEmail: session.user.email,
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this opportunity" },
        { status: 400 }
      );
    }

    // Create new application
    const application = new Application({
      opportunityId,
      userEmail: session.user.email,
      userName: session.user.name || responses.personal_info || "Anonymous",
      responses,
      status: "submitted",
      submittedAt: submittedAt || new Date(),
    });

    await application.save();

    // Update opportunity submission count
    await Opportunity.findByIdAndUpdate(opportunityId, {
      $inc: { submissionCount: 1 },
    });

    return NextResponse.json({
      success: true,
      applicationId: application._id,
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const opportunityId = searchParams.get("opportunityId");

    await connectToDatabase();

    const query: any = { userEmail: session.user.email };
    if (opportunityId) {
      query.opportunityId = opportunityId;
    }

    const applications = await Application.find(query)
      .populate({
        path: "opportunityId",
        select: "title organizerName applicationDeadline logoUrl slug",
      })
      .sort({ submittedAt: -1 });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
