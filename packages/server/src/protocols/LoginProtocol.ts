import {Inject} from "@tsed/di";
import {Unauthorized} from "@tsed/exceptions";
import {OnVerify, Protocol} from "@tsed/passport";
import {BodyParams, Context} from "@tsed/platform-params";
import {Groups} from "@tsed/schema";
import {IStrategyOptions, Strategy} from "passport-local";

import {User} from "../models/users/User.ts";
import {PassportMessage} from "../services/passport/ProtocolService.ts";
import {UserRepository} from "../services/users/UserRepository.ts";

@Protocol<IStrategyOptions>({
  name: "login",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class LoginProtocol implements OnVerify {
  @Inject()
  protected userRepository: UserRepository;

  async $onVerify(@BodyParams() @Groups("credentials", "create") {email, password}: User, @Context() $ctx: Context) {
    const user = await this.userRepository.findOne({
      email,
      password
    });

    if (!user) {
      throw new PassportMessage("Wrong credentials");
    }

    $ctx.set("user", user);

    return user;
  }
}
