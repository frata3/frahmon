export default function optionalAuth(req, res, next) {
  req.user = req.session?.user || null;
  next();
}