export default function authGuard(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "Authentication required",
    });
  }
  next();
}