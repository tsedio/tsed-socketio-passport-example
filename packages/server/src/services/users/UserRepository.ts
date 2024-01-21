import {Inject, Injectable} from "@tsed/di";
import {deserialize} from "@tsed/json-mapper";
import {MongooseModel} from "@tsed/mongoose";
import fs from "fs-extra";

import {User} from "../../models/users/User.ts";
import {MongooseRepository} from "../mongoose/MongooseRepository.ts";

@Injectable()
export class UserRepository extends MongooseRepository<User> {
  @Inject(User)
  protected model: MongooseModel<User>;

  async $onReady() {
    const count = await this.count();

    if (!count) {
      const users = fs.readJSONSync("./resources/users.json");

      for (const user of users) {
        const u = deserialize<User>(user);

        await this.save(u);
      }
    }
  }
}
