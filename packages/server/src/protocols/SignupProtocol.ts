import {BodyParams} from "@tsed/common";
import {Inject} from "@tsed/di";
import {Forbidden} from "@tsed/exceptions";
import {OnVerify, Protocol} from "@tsed/passport";
import {Groups} from "@tsed/schema";
import {Strategy} from "passport-local";

import {User} from "../models/users/User.ts";
import {UserRepository} from "../services/users/UserRepository.ts";

@Protocol({
  name: "signup",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class SignupLocalProtocol implements OnVerify {
  @Inject()
  protected usersRepository: UserRepository;

  async $onVerify(@BodyParams() @Groups("create") user: User) {
    const {email} = user;
    const found = await this.usersRepository.findOne({email});

    if (found) {
      throw new Forbidden("Email is already registered");
    }

    return this.usersRepository.save(user);
  }
}
