import { Schema, Types, model } from "mongoose";
import { nanoid } from "nanoid";

const commentSchema = new Schema(
  {
    _id: { type: String, default: () => nanoid(12), },
    post: { type: String, ref: "post", required: true, },
    author: { type: Types.ObjectId, ref: "User", required: true, },
    content: { type: String, required: true, trim: true, },
    parent: { type: String, ref: "comment", default: null, },
  },
  { timestamps: true }
);

const postsComment = model("comment", commentSchema);
export default postsComment;