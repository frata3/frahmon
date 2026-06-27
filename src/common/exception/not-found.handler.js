function notFoundHandler(app) {
  app.use(
    async (req, res, next) => {
      if (req.accepts("json") && !req.accepts("html")) {
        return res.status(404).json({ message: "Not Found" });
      }
      return res.status(404).render("./errors/404.ejs", {
        title: "صفحه یافت نشد"
      });
    }
  );
}
export default notFoundHandler;