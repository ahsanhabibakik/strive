// pages/api/getPosts.ts

import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Example: Simulating some data fetching (e.g., from a database or file)
  const posts = [
    {
      slug: "plant-based-brand",
      title: "Plant-Based Brand",
      date: "2025-04-10",
      readingTime: 5,
      content: "Content for the post",
    },
    {
      slug: "web-design-tips-for-beginners",
      title: "Web Design Tips for Beginners",
      date: "2025-04-09",
      readingTime: 3,
      content: "Content for the post",
    },
    // Add more posts here
  ];

  res.status(200).json(posts);
}
