import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  title: string;
  date: string;
  content: string;
  slug: string;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const dir = path.join(process.cwd(), 'src/content/blog');
    let filePath = path.join(dir, `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      filePath = path.join(dir, `${slug}.md`);
      if (!fs.existsSync(filePath)) return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(fileContent);
    
    return {
      title: data.title,
      date: data.date,
      content,
      slug
    };
  } catch (error) {
    console.error(`Error getting blog post ${slug}:`, error);
    return null;
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const dir = path.join(process.cwd(), 'src/content/blog');
  const files = fs.readdirSync(dir);
  
  const posts = await Promise.all(
    files
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
      .map(async file => {
        const slug = file.replace(/\.mdx?$/, '');
        const post = await getBlogPost(slug);
        return post;
      })
  );
  
  return posts.filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
} 