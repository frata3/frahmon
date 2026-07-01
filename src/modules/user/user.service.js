import autoBind from "auto-bind";
import UserModel from "./user.model.js";
import postsService from "../posts/posts.service.js";
class UserService {
  #userModel;
  constructor() {
    autoBind(this);
    this.#userModel = UserModel;
  }
  async create(userData) {
    const user = new this.#userModel(userData);
    await user.save();
    return user;
  }
  async findForSession(query) {
    return await this.#userModel
      .findOne(query, {
        email: 0,
        password: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
      })
      .lean();
  }
  async findOne(query) {
    return await this.#userModel.findOne(query).lean();
  }
  async getAccountData(userId) {
    const user = await this.#userModel
      .findById(userId)
      .select("-password -__v")
      .lean();

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
  async updateAccount(userId, data) {
    const { fullname, username, bio } = data;

    if (username) {
      const duplicate = await this.#userModel.findOne({
        username,
        _id: { $ne: userId },
      });
      if (duplicate) {
        throw new Error("Username already exists");
      }
    }

    const updateFields = {};
    if (fullname !== undefined) updateFields.fullname = fullname;
    if (username !== undefined) updateFields.username = username;
    if (bio !== undefined) updateFields.bio = bio;

    const user = await this.#userModel
      .findByIdAndUpdate(userId, updateFields, {
        returnDocument: "after",
        runValidators: true,
      })
      .select("-password -__v");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
export default new UserService();
