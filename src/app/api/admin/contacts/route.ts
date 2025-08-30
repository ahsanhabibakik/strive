import { NextRequest, NextResponse } from "next/server";
import { Contact } from "@/lib/models/Contact";
import { connectToDatabase } from "@/lib/database/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    await connectToDatabase();

    let query = {};
    if (status && status !== "all") {
      query = { status };
    }

    const [contacts, total] = await Promise.all([
      Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Contact.countDocuments(query),
    ]);

    // Add virtual fields manually since we're using lean()
    const contactsWithVirtuals = contacts.map(contact => ({
      ...contact,
      age: getAge(contact.createdAt),
    }));

    return NextResponse.json({
      contacts: contactsWithVirtuals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        total: await Contact.countDocuments(),
        new: await Contact.countDocuments({ status: "new" }),
        read: await Contact.countDocuments({ status: "read" }),
        replied: await Contact.countDocuments({ status: "replied" }),
        closed: await Contact.countDocuments({ status: "closed" }),
      },
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

// Helper function to calculate age
function getAge(createdAt: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(createdAt).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}
