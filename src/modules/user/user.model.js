import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['member', 'admin', 'author'], default: 'member', required: true },
    username: { type: String, required: true, unique: true },
    fullname: { type: String },
    avatar: { type: String, default: "/assets/pictures/default-avatar.png" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


const UserModel = model("User", UserSchema);
export default UserModel;