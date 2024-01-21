import {Model} from "@tsed/mongoose";
import {Description, Email, Groups, MinLength, Name, Required} from "@tsed/schema";
import {Component, Form, Label, Password} from "@tsed/schema-formio";

import {BaseModel} from "../common/BaseModel.ts";

@Model({name: "users"})
@Form()
export class User extends BaseModel {
  @Name("firstname")
  @Required()
  @MinLength(3)
  @Groups("!credentials")
  firstname: string;

  @Name("lastname")
  @Required()
  @MinLength(3)
  @Groups("!credentials")
  lastname: string;

  @Required()
  @Label("Email address")
  @Email()
  @Component({autocomplete: "email"})
  email: string;

  @Description("User phone number")
  @Groups("!credentials")
  phone: string;

  @Description("User address")
  @Groups("!credentials")
  address: string;

  @Name("password")
  @Required()
  @MinLength(6)
  @Groups("credentials", "create")
  @Label("Password")
  @Component({autocomplete: "current-password"})
  @Password()
  password: string;

  @Name("confirm_password")
  @Required()
  @MinLength(6)
  @Groups("!credentials", "create")
  @Label("Confirm password")
  @Component({autocomplete: "off"})
  confirmPassword: string;
}
