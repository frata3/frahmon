import { Schema, Types, model  } from 'mongoose';
import { nanoid } from 'nanoid';
const postSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(10)
    },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Types.ObjectId, ref: "User" , required: true},
    cover: {
      type: String,
      default: () => {
        const covers = [
          "/assets/pictures/default-post-cover-1.png",
          "/assets/pictures/default-post-cover-2.png",
          "/assets/pictures/default-post-cover-3.png"
        ];
        return covers[Math.floor(Math.random() * covers.length)];
      }
    }
  },
  { timestamps: true }
);
const postsPost = model("post", postSchema);
export default postsPost;