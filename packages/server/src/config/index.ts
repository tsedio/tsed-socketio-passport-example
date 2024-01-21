import {readFileSync} from "fs";

import {envs} from "./envs/index.js";
import loggerConfig from "./logger/index.js";
import mongooseConfig from "./mongoose/index.js";
import {sessionConfig, sessionMiddleware} from "./session/index.ts";
import viteConfig from "./vite/index.js";

const pkg = JSON.parse(readFileSync("./package.json", {encoding: "utf8"}));

export const config: Partial<TsED.Configuration> = {
  version: pkg.version,
  envs,
  logger: loggerConfig,
  mongoose: mongooseConfig,
  vite: viteConfig,
  swagger: [
    {
      path: "/doc",
      specVersion: "3.0.1"
    }
  ],
  session: sessionMiddleware
  // additional shared configuration
};
