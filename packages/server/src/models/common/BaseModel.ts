import {Immutable, ObjectID} from "@tsed/mongoose";
import {Example, Groups, Name, ReadOnly, Required} from "@tsed/schema";

export class HistoryBaseModel {
  @Required()
  @Immutable()
  @ReadOnly()
  @Name("created_at")
  @Groups("!create", "!update", "!summary", "!api")
  @Example(1667563214098)
  createdAt: number = Date.now();

  @Required()
  @ReadOnly()
  @Name("updated_at")
  @Groups("!create", "!update", "!summary", "!api")
  @Example(1667563214098)
  updatedAt: number = Date.now();
}

export class BaseModel extends HistoryBaseModel {
  @ObjectID("id")
  @Required()
  @Groups("!create")
  _id: string;
}
