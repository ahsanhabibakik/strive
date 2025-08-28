import { ObjectId } from 'mongodb';

export interface BlogPost {
  _id?: ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  date: string; // ISO string
  readingTime?: string;
}