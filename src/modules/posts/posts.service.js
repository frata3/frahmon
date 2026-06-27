import autoBind from 'auto-bind';
import PostModel from './post.posts.model.js';
import CommentModel from './comment.posts.model.js';
class PostService {
  #postModel;
  #commentModel;
  constructor() {
    autoBind(this);
    this.#postModel = PostModel;
    this.#commentModel = CommentModel;
  }
  async getPosts() {
    return await this.#postModel
      .find({})
      .populate({ path: "author", select: "_id fullname username avatar" })
      .lean();
  }
  async getPostById(id) {
    return await this.#postModel
      .findOne({ _id: id })
      .populate([
        { path: "author", select: "fullname username _id" }
      ])
      .lean();
  }
  async deleteById(id) {
    return await this.#postModel.findByIdAndDelete(id);
  }
  async createPost(data) {
    return this.#postModel.create( data );
  }
  async getCommentsByPost(postId) {
    return await this.#commentModel
      .find({ post: postId })
      .populate({ path: "author", select: "_id fullname username avatar" })
      .sort({ createdAt: -1 })
      .lean();
  }
  async createComment(data) {
    return await this.#commentModel.create(data);
  }  
}
export default new PostService();