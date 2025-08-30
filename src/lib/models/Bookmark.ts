import mongoose, { Document, Schema } from "mongoose";

export interface IBookmark extends Document {
  opportunityId: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    opportunityId: {
      type: Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one bookmark per user per opportunity
BookmarkSchema.index({ opportunityId: 1, userEmail: 1 }, { unique: true });

// Index for fetching user bookmarks sorted by creation date
BookmarkSchema.index({ userEmail: 1, createdAt: -1 });

const Bookmark = mongoose.models.Bookmark || mongoose.model<IBookmark>("Bookmark", BookmarkSchema);

export default Bookmark;
