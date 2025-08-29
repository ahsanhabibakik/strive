import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/lib/models/User";
import { Project } from "@/lib/models/Project";
import { Task } from "@/lib/models/Task";
import { EmailLog } from "@/lib/models/EmailLog";
import { RBAC } from "@/lib/rbac";
import connectToDatabase from "@/lib/mongoose";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    await connectToDatabase();
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser || !RBAC.hasPermission(currentUser, "admin:dashboard:read")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30"; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get all dashboard data in parallel for better performance
    const [
      userStats,
      projectStats,
      taskStats,
      emailStats,
      systemHealth,
      recentActivity,
      growthMetrics,
      revenueData,
    ] = await Promise.all([
      getUserStatistics(startDate),
      getProjectStatistics(startDate),
      getTaskStatistics(startDate),
      getEmailStatistics(startDate),
      getSystemHealth(),
      getRecentActivity(),
      getGrowthMetrics(startDate),
      getRevenueData(startDate),
    ]);

    return NextResponse.json({
      overview: {
        users: userStats,
        projects: projectStats,
        tasks: taskStats,
        emails: emailStats,
      },
      system: systemHealth,
      activity: recentActivity,
      growth: growthMetrics,
      revenue: revenueData,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getUserStatistics(startDate: Date) {
  const [totalUsers, activeUsers, newUsers, usersByPlan, usersByRole] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ createdAt: { $gte: startDate } }),

    User.aggregate([
      {
        $group: {
          _id: "$subscription.plan",
          count: { $sum: 1 },
        },
      },
    ]),

    User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  return {
    total: totalUsers,
    active: activeUsers,
    inactive: totalUsers - activeUsers,
    new: newUsers,
    byPlan: usersByPlan.reduce((acc: any, item: any) => {
      acc[item._id || "free"] = item.count;
      return acc;
    }, {}),
    byRole: usersByRole.reduce((acc: any, item: any) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
  };
}

async function getProjectStatistics(startDate: Date) {
  try {
    const [totalProjects, activeProjects, newProjects, completedProjects, projectsByStatus] =
      await Promise.all([
        Project.countDocuments(),
        Project.countDocuments({ status: "active" }),
        Project.countDocuments({ createdAt: { $gte: startDate } }),
        Project.countDocuments({ status: "completed" }),

        Project.aggregate([
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

    return {
      total: totalProjects,
      active: activeProjects,
      new: newProjects,
      completed: completedProjects,
      byStatus: projectsByStatus.reduce((acc: any, item: any) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };
  } catch (_error) {
    // Handle case where Project model might not exist yet
    return {
      total: 0,
      active: 0,
      new: 0,
      completed: 0,
      byStatus: {},
    };
  }
}

async function getTaskStatistics(startDate: Date) {
  try {
    const [totalTasks, completedTasks, newTasks, tasksByPriority, tasksByStatus] =
      await Promise.all([
        Task.countDocuments(),
        Task.countDocuments({ status: "completed" }),
        Task.countDocuments({ createdAt: { $gte: startDate } }),

        Task.aggregate([
          {
            $group: {
              _id: "$priority",
              count: { $sum: 1 },
            },
          },
        ]),

        Task.aggregate([
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      total: totalTasks,
      completed: completedTasks,
      new: newTasks,
      completionRate: Math.round(completionRate * 100) / 100,
      byPriority: tasksByPriority.reduce((acc: any, item: any) => {
        acc[item._id || "medium"] = item.count;
        return acc;
      }, {}),
      byStatus: tasksByStatus.reduce((acc: any, item: any) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };
  } catch (_error) {
    // Handle case where Task model might not exist yet
    return {
      total: 0,
      completed: 0,
      new: 0,
      completionRate: 0,
      byPriority: {},
      byStatus: {},
    };
  }
}

async function getEmailStatistics(startDate: Date) {
  try {
    const emailStats = await EmailLog.getEmailStats(startDate);

    const recentEmails = await EmailLog.find({ sentAt: { $gte: startDate } })
      .select("status sentAt")
      .sort({ sentAt: -1 })
      .limit(1000)
      .lean();

    // Calculate daily email volume
    const dailyVolume: Record<string, number> = {};
    recentEmails.forEach(email => {
      const date = email.sentAt.toISOString().split("T")[0];
      dailyVolume[date] = (dailyVolume[date] || 0) + 1;
    });

    return {
      ...emailStats,
      dailyVolume: Object.entries(dailyVolume)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    };
  } catch (_error) {
    return {
      totalSent: 0,
      totalDelivered: 0,
      totalOpened: 0,
      totalClicked: 0,
      totalBounced: 0,
      totalFailed: 0,
      deliveryRate: 0,
      openRate: 0,
      clickRate: 0,
      bounceRate: 0,
      providers: [],
      templates: [],
      dailyVolume: [],
    };
  }
}

async function getSystemHealth() {
  try {
    // Database connection status
    const dbStatus = mongoose.connection.readyState === 1 ? "healthy" : "unhealthy";

    // Get database stats
    const dbStats = await mongoose.connection.db.stats();

    // Memory usage
    const memoryUsage = process.memoryUsage();

    // System uptime
    const uptime = process.uptime();

    return {
      database: {
        status: dbStatus,
        collections: dbStats.collections,
        dataSize: dbStats.dataSize,
        indexSize: dbStats.indexSize,
        storageSize: dbStats.storageSize,
      },
      application: {
        uptime: Math.floor(uptime),
        memory: {
          used: memoryUsage.heapUsed,
          total: memoryUsage.heapTotal,
          external: memoryUsage.external,
          rss: memoryUsage.rss,
        },
        nodeVersion: process.version,
        platform: process.platform,
      },
      status: dbStatus === "healthy" ? "healthy" : "degraded",
    };
  } catch (error) {
    return {
      database: { status: "unhealthy" },
      application: { status: "unhealthy" },
      status: "unhealthy",
      error: error.message,
    };
  }
}

async function getRecentActivity() {
  try {
    // Get recent user registrations
    const recentUsers = await User.find({}, { name: 1, email: 1, createdAt: 1, role: 1 })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get recent projects
    const recentProjects = await Project.find(
      {},
      { title: 1, createdAt: 1, status: 1, createdBy: 1 }
    )
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get recent email activity
    const recentEmails = await EmailLog.find(
      {},
      {
        to: 1,
        subject: 1,
        status: 1,
        sentAt: 1,
        template: 1,
      }
    )
      .sort({ sentAt: -1 })
      .limit(10)
      .lean();

    return {
      users: recentUsers.map(user => ({
        type: "user_registered",
        user: { name: user.name, email: user.email, role: user.role },
        timestamp: user.createdAt,
      })),
      projects: recentProjects.map(project => ({
        type: "project_created",
        project: { title: project.title, status: project.status },
        user: project.createdBy,
        timestamp: project.createdAt,
      })),
      emails: recentEmails.map(email => ({
        type: "email_sent",
        email: {
          to: email.to[0],
          subject: email.subject,
          template: email.template,
          status: email.status,
        },
        timestamp: email.sentAt,
      })),
    };
  } catch (_error) {
    return {
      users: [],
      projects: [],
      emails: [],
    };
  }
}

async function getGrowthMetrics(startDate: Date) {
  try {
    // User growth over time
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
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
        },
      },
      {
        $sort: { date: 1 },
      },
      {
        $project: {
          _id: 0,
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          users: "$count",
        },
      },
    ]);

    return {
      userGrowth,
      totalGrowth: userGrowth.reduce((sum, day) => sum + day.users, 0),
    };
  } catch (_error) {
    return {
      userGrowth: [],
      totalGrowth: 0,
    };
  }
}

async function getRevenueData(_startDate: Date) {
  try {
    // Revenue calculation based on subscription plans
    const subscriptionData = await User.aggregate([
      {
        $match: {
          "subscription.status": "active",
          "subscription.plan": { $ne: "free" },
        },
      },
      {
        $group: {
          _id: "$subscription.plan",
          count: { $sum: 1 },
        },
      },
    ]);

    // Plan pricing (should come from a config or database)
    const planPricing: Record<string, number> = {
      pro: 29,
      enterprise: 99,
    };

    let totalMRR = 0;
    const revenueByPlan = subscriptionData.map(plan => {
      const monthlyRevenue = plan.count * (planPricing[plan._id] || 0);
      totalMRR += monthlyRevenue;

      return {
        plan: plan._id,
        subscribers: plan.count,
        monthlyRevenue,
      };
    });

    const totalARR = totalMRR * 12;

    return {
      mrr: totalMRR,
      arr: totalARR,
      byPlan: revenueByPlan,
      totalSubscribers: subscriptionData.reduce((sum, plan) => sum + plan.count, 0),
    };
  } catch (_error) {
    return {
      mrr: 0,
      arr: 0,
      byPlan: [],
      totalSubscribers: 0,
    };
  }
}
