import autoBind from "auto-bind";
import AuthService from "./auth.service.js";

class AuthController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = AuthService;
  }
  async checkEmail(req, res, next) {
    try {
      const { email } = req.body;
      const user = await this.#service.findUserByEmail(email);
      if (user) {
        return res.status(200).render("pages/auth-user/login", {
          email,
          user,
        });
      }
      return res.status(200).render("pages/auth-user/register", {
        email,
      });
  
    } catch (error) {
      return res.status(500).render("error", {
        status: "error",
        error_code: "check email failed",
        message: "Internal server error",
      });
    }
  }
  async renderAuthPage(req, res, next) {
    try {
      
      res.render("pages/auth-user/check-email.ejs", {
        title: "ساخت حساب",
      });
    } catch (error) {
      next(error);
    }
  }
  async register(req, res, next) {
    try {
      const {  password, email, username } = req.body;
      const user = await this.#service.createUser({
        password,
        email,
        username,
        // role: "member"
      });
      req.session.user = {
        _id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role
      };
      return res.redirect(303, '/');

    } catch (error) {
      return res.status(error.statusCode || 400).json({
        status: "error",
        error_code: error.code || "registration failed",
        message: error.message || "Registration failed",
      });
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          status: "error",
          message: "Email and password are required",
        });
      }
      const user = await this.#service.authenticate({ email, password });
      req.session.user = {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
      };
      return res.redirect(303, '/');
    } catch (error) {
      console.error("Login error:", error);
      return res.status(401).json({
        status: "error",
        error_code: "authentication_failed",
        message: error.message || "Invalid email or password",
      });
    }
  }
  async logout(req, res) {
    try {
      req.session.destroy((error) => {
        if (error) {
          console.error("Logout error:", error);

          if (req.xhr || req.headers.accept?.includes("application/json")) {
            return res.status(500).json({
              status: "error",
              error_code: "logout_failed",
              message: "Failed to logout",
            });
          }
          return res.redirect("/");
        }

        if (req.xhr || req.headers.accept?.includes("application/json")) {
          return res.status(200).json({
            status: "success",
            message: "Logout successful",
          });
        }

        return res.redirect(303, '/');
      });
    } catch (error) {
      console.error("Logout error:", error);

      if (req.xhr || req.headers.accept?.includes("application/json")) {
        return res.status(500).json({
          status: "error",
          error_code: "logout_failed",
          message: "Internal server error",
        });
      }
      res.redirect("/");
    }
  }
}
export default new AuthController();