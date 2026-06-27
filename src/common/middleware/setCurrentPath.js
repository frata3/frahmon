export default function setCurrentPath(req, res, next) {
  const path = req.path;
  const parts = path.split("/").filter(Boolean);
  res.locals.currentPath = path;
  res.locals.section = parts[1] || null;
  res.locals.page = parts[2] || null;
  next();
}