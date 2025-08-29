import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/lib/models/User";
import { EmailLog } from "@/lib/models/EmailLog";
import { RBAC } from "@/lib/rbac";
import connectToDatabase from "@/lib/mongoose";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });

    if (!user || !RBAC.hasPermission(user, "emails:read")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    const type = searchParams.get("type") || "overview";

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    switch (type) {
      case "overview":
        return await getOverviewStats(startDate);

      case "templates":
        return await getTemplateStats(startDate);

      case "activity":
        return await getRecentActivity();

      case "trends":
        return await getTrendData(startDate);

      default:
        return NextResponse.json({ error: "Invalid stats type" }, { status: 400 });
    }
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getOverviewStats(startDate: Date) {
  const stats = await EmailLog.getEmailStats(startDate);

  // Get provider breakdown
  const providerStats = await EmailLog.aggregate([
    {
      $match: {
        sentAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: "$provider",
        count: { $sum: 1 },
        successful: {
          $sum: {
            $cond: [{ $in: ["$status", ["sent", "delivered", "opened", "clicked"]] }, 1, 0],
          },
        },
        failed: {
          $sum: {
            $cond: [{ $eq: ["$status", "failed"] }, 1, 0],
          },
        },
      },
    },
  ]);

  return NextResponse.json({
    overview: stats,
    providers: providerStats.map(p => ({
      provider: p._id,
      total: p.count,
      successful: p.successful,
      failed: p.failed,
      successRate: p.count > 0 ? (p.successful / p.count) * 100 : 0,
    })),
  });
}

async function getTemplateStats(startDate: Date) {
  const templateStats = await EmailLog.getTemplateStats(startDate);

  return NextResponse.json({
    templates: templateStats,
  });
}

async function getRecentActivity() {
  const activity = await EmailLog.getRecentActivity(100);

  return NextResponse.json({
    activity: activity.map(email => ({
      id: email._id,
      to: email.to,
      subject: email.subject,
      template: email.template,
      status: email.status,
      provider: email.provider,
      sentAt: email.sentAt,
      error: email.error,
    })),
  });
}

async function getTrendData(startDate: Date) {
  // Daily email volume for the past period
  const dailyStats = await EmailLog.aggregate([
    {
      $match: {
        sentAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$sentAt" },
          month: { $month: "$sentAt" },
          day: { $dayOfMonth: "$sentAt" },
        },
        totalSent: { $sum: 1 },
        successful: {
          $sum: {
            $cond: [{ $in: ["$status", ["sent", "delivered", "opened", "clicked"]] }, 1, 0],
          },
        },
        failed: {
          $sum: {
            $cond: [{ $eq: ["$status", "failed"] }, 1, 0],
          },
        },
        opened: {
          $sum: {
            $cond: [{ $in: ["$status", ["opened", "clicked"]] }, 1, 0],
          },
        },
        clicked: {
          $sum: {
            $cond: [{ $eq: ["$status", "clicked"] }, 1, 0],
          },
        },
      },
    },
    {
      $addFields: {
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          },
        },
        successRate: {
          $cond: [
            { $gt: ["$totalSent", 0] },
            { $multiply: [{ $divide: ["$successful", "$totalSent"] }, 100] },
            0,
          ],
        },
        openRate: {
          $cond: [
            { $gt: ["$successful", 0] },
            { $multiply: [{ $divide: ["$opened", "$successful"] }, 100] },
            0,
          ],
        },
        clickRate: {
          $cond: [
            { $gt: ["$opened", 0] },
            { $multiply: [{ $divide: ["$clicked", "$opened"] }, 100] },
            0,
          ],
        },
      },
    },
    {
      $sort: { date: 1 },
    },
    {
      $project: {
        _id: 0,
        date: 1,
        totalSent: 1,
        successful: 1,
        failed: 1,
        opened: 1,
        clicked: 1,
        successRate: 1,
        openRate: 1,
        clickRate: 1,
      },
    },
  ]);

  return NextResponse.json({
    trends: dailyStats,
  });
}
