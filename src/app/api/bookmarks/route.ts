import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose-simple";
import Bookmark from "@/lib/models/Bookmark";
import Opportunity from "@/lib/models/Opportunity";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { opportunityId } = body;

    if (!opportunityId) {
      return NextResponse.json({ error: "Opportunity ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Verify opportunity exists
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({
      opportunityId,
      userEmail: session.user.email,
    });

    if (existingBookmark) {
      // Remove bookmark (toggle off)
      await Bookmark.deleteOne({
        opportunityId,
        userEmail: session.user.email,
      });

      return NextResponse.json({
        bookmarked: false,
        message: "Bookmark removed",
      });
    } else {
      // Add bookmark (toggle on)
      const bookmark = new Bookmark({
        opportunityId,
        userEmail: session.user.email,
        userName: session.user.name || "Anonymous",
      });

      await bookmark.save();

      return NextResponse.json({
        bookmarked: true,
        message: "Bookmark added",
      });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
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

    if (opportunityId) {
      // Check if specific opportunity is bookmarked
      const bookmark = await Bookmark.findOne({
        opportunityId,
        userEmail: session.user.email,
      });

      return NextResponse.json({
        bookmarked: !!bookmark,
      });
    } else {
      // Get all bookmarks for user
      const bookmarks = await Bookmark.find({
        userEmail: session.user.email,
      })
        .populate({
          path: "opportunityId",
          select:
            "title slug category organizerName applicationDeadline isOnline country city isFree difficulty viewCount submissionCount logoUrl tags",
        })
        .sort({ createdAt: -1 });

      // Filter out bookmarks where the opportunity might have been deleted
      const validBookmarks = bookmarks.filter(bookmark => bookmark.opportunityId);

      return NextResponse.json({ bookmarks: validBookmarks });
    }
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const opportunityId = searchParams.get("opportunityId");

    if (!opportunityId) {
      return NextResponse.json({ error: "Opportunity ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const result = await Bookmark.deleteOne({
      opportunityId,
      userEmail: session.user.email,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Bookmark removed",
    });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
