import { Router } from 'express';
import postController from './posts.controller.js';
import requireLogin from "../../common/middleware/requireLogin.js";

const router = Router();
router.use((req, res, next) => {
    res.addAssets({ css: ["/assets/css/posts.css"]});
    next()
})
router.get("/", postController.postsMainPage);
router.get("/new", requireLogin, postController.createPostPage);
router.get("/:id", postController.redirectToPost);
router.get("/:id/:slug", postController.getPost);
router.post("/new", requireLogin, postController.createPost);
router.post("/:id/comments", requireLogin, postController.createComment);
router.delete("/:id", postController.deletePost);
export default router;