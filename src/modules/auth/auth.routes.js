import { Router } from "express";
import AuthController from "./auth.controller.js";
const router = Router();
router.use((req, res, next) => {
    res.addAssets({
        css: ["/assets/css/auth-user.css"],
        // js: [{ src: "/scripts/auth.js", type: "module", defer: true }],
    });
    next()
})
router.get("/", AuthController.renderAuthPage);
router.get("/logout", AuthController.logout);

router.post("/check-email", AuthController.checkEmail);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);


export default router;
