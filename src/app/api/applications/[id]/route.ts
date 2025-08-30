import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose-simple";
import Application from "@/lib/models/Application";
import Opportunity from "@/lib/models/Opportunity";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const application = await Application.findOne({
      _id: params.id,
      userEmail: session.user.email,
    }).populate({
      path: "opportunityId",
      select: "title organizerName applicationDeadline logoUrl slug",
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, reviewerNotes } = body;

    // For now, only allow users to withdraw their own applications
    const allowedUserStatuses = ["withdrawn"];
    
    if (status && !allowedUserStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status update" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const application = await Application.findOne({
      _id: params.id,
      userEmail: session.user.email,
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Prevent withdrawing already processed applications
    if (application.status === "accepted" || application.status === "rejected") {
      return NextResponse.json(
        { error: "Cannot withdraw processed application" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (reviewerNotes !== undefined) updateData.reviewerNotes = reviewerNotes;
    
    const updatedApplication = await Application.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    ).populate({
      path: "opportunityId",
      select: "title organizerName applicationDeadline logoUrl slug",
    });

    return NextResponse.json({ application: updatedApplication });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const application = await Application.findOne({
      _id: params.id,
      userEmail: session.user.email,
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Only allow deletion of draft or withdrawn applications
    if (!["submitted", "withdrawn"].includes(application.status)) {
      return NextResponse.json(
        { error: "Cannot delete processed application" },
        { status: 400 }
      );
    }

    await Application.findByIdAndDelete(params.id);

    // Decrement opportunity submission count if it was submitted
    if (application.status === "submitted") {
      await Opportunity.findByIdAndUpdate(application.opportunityId, {
        $inc: { submissionCount: -1 },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}