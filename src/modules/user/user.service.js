import autoBind from "auto-bind";
import UserModel from "./user.model.js";
import postsService from "../posts/posts.service.js";
class UserService {
  #userModel;
  #postsService;
  constructor() {
    autoBind(this);
    this.#userModel = UserModel;
    this.#postsService = postsService;
  }
  async findForSession(query) {
    return await this.#userModel.findOne(query, {
      email: 0,
      password: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    }).lean();
  }
  async findOne(query) {
    return await this.#userModel.findOne(query).lean();
  }
  async findUsersList() {
    const users = await this.#userModel.find({}, { password: 0, __v: 0 }).lean();
    return users;
  }
  async findByUsername(username) {
    return await this.#userModel
      .findOne({ username })
      .select("_id username fullname avatar")
      .lean();
  }
  async findById(id) {
    return await this.#userModel.findById(id).lean();
  }
  async isEmailTaken(email) {
    return await this.#userModel.findOne({ email }).lean();
  }
  async isUsernameTaken(username) {
    return await this.#userModel.findOne({ username }).lean();
  }
  async update(user, field, value) {
    user[field] = value;
    await user.save();
    return user;
  }
  async create(userData) {
    const user = new this.#userModel(userData);
    await user.save();
    return user;
  }
  async findpostsPosts(userId, sort = "latest") {
    return await this.#postsService.findUserPosts(userId, sort).lean();
  }
  
  async findPublicPosts(username) {
    const user = await this.#userModel.findOne({ username }).select("_id").lean();
    if (!user) return [];

    return await this.#postsService.getPostsByUser(user._id);
  }
  async createPost(postData) {
    return await this.#postsService.create(postData);
  }
}
export default new UserService();
