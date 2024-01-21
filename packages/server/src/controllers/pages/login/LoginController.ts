import {Controller} from "@tsed/di";
import {Authenticate} from "@tsed/passport";
import {BodyParams, Context} from "@tsed/platform-params";
import {Get, Groups, Hidden, Post, Returns} from "@tsed/schema";
import {getFormioSchema} from "@tsed/schema-formio";
import {Vite} from "@tsed/vite-ssr-plugin";

import {User} from "../../../models/users/User.ts";

@Hidden()
@Controller("/")
export class LoginController {
  @Get("/")
  @Get("/login")
  @Vite()
  @Returns(200, String).ContentType("text/html")
  async login(@Context() $ctx: Context) {
    const errors = $ctx.request.session.messages
    $ctx.request.session.messages = [];

    return {
      errors,
      form: await getFormioSchema("User", {
        useAlias: true,
        groups: [
          "create",
          "credentials"
        ]
      })
    };
  }

  @Post("/login")
  @Authenticate("login", {
    failureRedirect: "/",
    successRedirect: "/dashboard",
    failureMessage: true
  })
  @Returns(302, User).Groups("credentials")
  @Returns(400).Description("Validation error")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  submitLogin(@BodyParams() @Groups("create", "credentials") credentials: User) {
    return {}
  }
}
