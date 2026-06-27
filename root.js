import helmet from "helmet";
import express from "express";
import router from "./src/app.routes.js";
import expressEjsLayouts from "express-ejs-layouts";
import { connectDB } from "./src/config/mongoose.config.js";
import session from "express-session";
import flash from "connect-flash";
import MongoStore from "connect-mongo";
import notFoundHandler from "./src/common/exception/not-found.handler.js";
import allExceptionHandler from "./src/common/exception/all-exception.handler.js";
import http from "http";
import 'dotenv/config';

async function main() {
  const app = express();
  app.use(helmet());
  const port = process.env.EXPRESS_PORT;
  const server = http.createServer(app);
  await connectDB();
  // app.set('trust proxy', 1);

  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  });

  app.use(sessionMiddleware);
  app.use(flash());

  
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: true, limit: "100kb" }));
  app.use((req, res, next) => {
    if (req.path.startsWith("/assets/css/dynamic")) {
      return next();
    }
    express.static("public", {maxAge: "7d",  etag: true})(req, res, next);
  });
  app.set("view engine", "ejs");
  app.set("views", "./views");
  app.use(expressEjsLayouts);
  app.set("layout", "./layouts/main/main");
  app.use(router);
  notFoundHandler(app);
  allExceptionHandler(app);
  server.listen(port, () => {
    console.log(`server: http://localhost:${port}`);
  });
}
main();