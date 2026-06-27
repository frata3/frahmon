export default function requireLogin(req, res, next) {
    if (!req.session.user) {
      return res.status(401).json({
        status: "unauthorized",
        error_code: "401",
        message: "Authentication required"
      });
    }
    next();
  }  