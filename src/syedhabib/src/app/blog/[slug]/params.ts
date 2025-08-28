// src/app/blog/[slug]/params.ts

import fs from 'fs';
import path from 'path';

// Generate static params (the list of all blog slugs)
export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'src/content/blog');
  const files = fs.readdirSync(dir);

  return files.map((file) => ({
    slug: file.replace(/\.mdx?$/, ''), // Extract slug from filename
  }));
}
