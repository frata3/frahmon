const OptionalAuth = (req, res, next) => {
  try {
    req.session.user = req.session?.user || null;
    next();
  } catch (error) {
    console.error("OptionalAuth error:", error);
    req.session.user = null;
    next();
  }
};

export default OptionalAuth;