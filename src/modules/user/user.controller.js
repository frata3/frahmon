import autoBind from "auto-bind";
import UserService from "./user.service.js";
class UserController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = UserService;
  }
  async userMainPage(req, res, next) {
    try {
      res.addAssets({
        css: ["/assets/css/user.css"],
        js: [{ src: "/scripts/user.js", type: "module" }],
      });
      res.render("pages/user/profile.user.ejs", {
        user: req.profile,
        isOwner: req.isOwner
    });
    } catch (error) {
      next(error);
    }
  }
  async userAccountPage(req, res, next) {
    try {
      const userId = req.session.user._id;
      const user = await this.#service.getAccountData(userId);

      res.addAssets({
        css: ["/assets/css/user.css"],
        js: [{ src: "/scripts/user.js", type: "module" }],
      });

      res.render("pages/user/account.user.ejs", {
        user,
      });

    } catch (error) {
      next(error);
    }
  }
  async updateAccount(req, res, next) {
    try {
      const userId = req.session.user._id;
      const data = req.body;
  
      const user = await this.#service.updateAccount(userId, data);
  
      req.session.user = {
        _id: user._id,
        username: user.username,
      };
  
      return res.json({
        status: "success",
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      if (error.message === "Username already exists") {
        return res.status(409).json({ status: "error", message: error.message });
      }
      if (error.message === "User not found") {
        return res.status(404).json({ status: "error", message: error.message });
      }
      next(error);
    }
  }
}
export default new UserController();