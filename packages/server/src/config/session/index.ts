import MongoStore from "connect-mongo";
import session, {SessionOptions} from "express-session";

import defaultConfig from "../mongoose/default.config.ts";


export const sessionConfig = {
  secret: String(process.env.SESSION_SECRET || "secret"),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: Number(process.env.SESSION_MAX_AGE || 3600000),
    secure: process.env.SESSION_SECURE === "true"
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_SESSION_URL || defaultConfig.url,
    mongoOptions: defaultConfig.connectionOptions
  })
} satisfies SessionOptions;

export const sessionMiddleware = session(sessionConfig);
