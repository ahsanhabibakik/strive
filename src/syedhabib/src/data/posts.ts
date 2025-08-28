export interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
}

export const posts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js',
    date: '2024-03-15',
    excerpt: 'Learn how to build modern web applications with Next.js',
    content: 'Next.js is a powerful React framework that makes building web applications easier...',
    author: {
      name: 'John Doe',
      avatar: '/avatars/john.jpg',
    },
    tags: ['Next.js', 'React', 'Web Development'],
  },
  {
    id: '2',
    title: 'Understanding TypeScript',
    date: '2024-03-14',
    excerpt: 'A comprehensive guide to TypeScript for JavaScript developers',
    content: 'TypeScript adds static typing to JavaScript, making your code more reliable...',
    author: {
      name: 'Jane Smith',
      avatar: '/avatars/jane.jpg',
    },
    tags: ['TypeScript', 'JavaScript', 'Programming'],
  },
]; 