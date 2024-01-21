import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/ajv";
import "@tsed/swagger";
import "@tsed/mongoose";
import "@tsed/passport";
import "./protocols/index.ts";
import "./services/passport/ProtocolService.ts";
import "./ws/services/index.ts";

import {Configuration} from "@tsed/di";
import {join} from "path";

import {config} from "./config/index.ts";
import {sessionMiddleware} from "./config/session/index.ts";
import * as pages from "./controllers/pages/index.ts";
import * as rest from "./controllers/rest/index.ts";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  disableComponentsScan: true,
  ajv: {
    returnsCoercedValues: true
  },
  mount: {
    "/rest": [
      ...Object.values(rest)
    ],
    "/": [
      ...Object.values(pages)
    ]
  },
  middlewares: [
    "cors",
    "cookie-parser",
    {
      use: "compression",
      options: {
        brotli: {
          enabled: true,
          zlib: {}
        }
      }
    },
    "method-override",
    "json-parser",
    {use: "urlencoded-parser", options: {extended: true}},
    sessionMiddleware
  ],
  views: {
    root: join(process.cwd(), "../views"),
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: [
    "**/*.spec.ts"
  ]
})
export class Server {

}
