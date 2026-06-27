import autoBind from 'auto-bind';
import PostService from './posts.service.js';
import generateSlug from '../../common/utils/slugGenerator.util.js';

class PostController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = PostService; 
  }
  async postsMainPage(req, res, next) {
    try {
      const posts = await this.#service.getPosts();
      res.render("pages/posts/index.posts.ejs", {
        posts,
        title: "بلاگ",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async getPost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await this.#service.getPostById(id);

      const comments = await this.#service.getCommentsByPost(id);
      if (!post) {
        return res.status(404).send("پست مورد نظر یافت نشد.");
      }
      res.render("pages/posts/single.posts.ejs", {
        post,
        comments,
        title: "صفحه اصلی",
      });
    } catch (error) {
      next(error);
    }
  }
  async createPostPage(req, res, next) {
    try {
      res.render("pages/posts/posts.new.ejs", {
        title: "ساخت پست بلاگ",
      });
    } catch (error) {
      next(error);
    }
  }
  async createPost(req, res, next) {
    try {
      const { title, content } = req.body;

      const post = await this.#service.createPost({
        title,
        slug: generateSlug(title),
        content,
        author: req.session.user._id,
      });
      res.redirect(`/posts/${post.id}/${post.slug}`);
    } catch (err) {
      next(err);
    }
  }
  async deletePost(req, res) {
    const { id } = req.params;
    const userId = req.session.user._id;
    const post = await this.#service.getPostById(id);

    if (!post || post.author._id !== userId)
      return res.status(403).send("شما مجاز به حذف این پست نیستید");

    await this.#service.deleteById(id);
    return res.status(200).send("پست حذف شد");
  }
  async redirectToPost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await this.#service.getPostById(id);
    
      if (!post) return res.status(404).send("پست یافت نشد");

      return res.redirect(301, `/posts/${id}/${post.slug}`);
    } catch (err) {
      next(err);
    }
  }
  async createComment(req, res, next) {
    try {
      const { id } = req.params;
      const { content, parent } = req.body;
      await this.#service.createComment({
        post: id,
        content,
        parent: parent || null,
        author: req.session.user._id
      });
  
      res.redirect("back");
    } catch (error) {
      next(error);
    }
  }  
}
export default new PostController();