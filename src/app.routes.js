import { Router } from "express";
import { addAssetsSupport } from "./common/middleware/addAssetsSupport.js";
import setCurrentPath from "./common/middleware/setCurrentPath.js";
import { registerJalaliHelpers } from "./common/utils/jalalidate.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import OptionalAuth from "./common/guard/optional-auth.guard.js";
import profileGuard from "./common/guard/profile.Guard.js";
import postsRoutes from "./modules/posts/posts.routes.js"

const router = Router();
router.use(setCurrentPath);
router.use(addAssetsSupport);
router.use(registerJalaliHelpers);
router.use(OptionalAuth);

router.use((req, res, next) => {
  res.locals.currentUser = req.session.user || "guest";
  next();
});

router.get('/', (req, res, next) => {
  res.addAssets({ css: ["/assets/css/home.css"]});
  res.render("./pages/home.ejs")
})
router.get('/roadmap', (req, res, next) => {
  res.addAssets({ css: ["/assets/css/roadmap.css"]});
  res.render("./pages/roadmap.ejs");
})
router.use("/auth", authRoutes);
router.use("/@:username", profileGuard, userRoutes);
router.use("/posts", postsRoutes);

export default router;