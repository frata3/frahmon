import { Router } from 'express';
const router = Router({ mergeParams: true });
import userController from './user.controller.js'
router.use((req, res, next) => {
    res.addAssets({
        css: ["/assets/css/user.css"],
        // js: [{ src: "/scripts/auth.js", type: "module", defer: true }],
    });
    next()
})
router.get("/", userController.userMainPage);
router.get("/posts/posts", userController.getUserpostsPosts);
router.get("/posts/forum", userController.getUserForumPosts);

export default router;
  