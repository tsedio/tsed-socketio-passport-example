import {Req} from "@tsed/common";
import {Controller} from "@tsed/di";
import {Authenticate} from "@tsed/passport";
import {Get, Hidden, Returns} from "@tsed/schema";
import {Vite} from "@tsed/vite-ssr-plugin";

import {User} from "../../../models/users/User.ts";

@Hidden()
@Controller("/")
export class DashboardController {
  @Get("/dashboard")
  @Vite()
  @Authenticate("login", {
    failureRedirect: "/",
    failureMessage: true
  })
  @Returns(200, String).ContentType("text/html")
  async signup(@Req("user") user: User) {
    return {
      email: user.email
    };
  }
}
