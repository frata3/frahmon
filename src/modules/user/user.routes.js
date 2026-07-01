import { Router } from 'express';
const router = Router({ mergeParams: true });
import userController from './user.controller.js'
import authGuard from '../../common/guard/auth.guard.js';
router.use((req, res, next) => {
    res.addAssets({
        css: ["/assets/css/user.css"],
        js: [{ src: "/scripts/user.js", type: "module", defer: true }],
    });
    next()
})
router.get("/", userController.userMainPage);
router.get("/account", userController.userAccountPage);
router.put("/account", authGuard, userController.updateAccount);

export default router;
  