import { ObjectId } from 'mongodb';

export interface Activity {
  _id?: ObjectId;
  action: string; // e.g., "Created post"
  timestamp: string; // ISO
  meta?: Record<string, unknown>;
}