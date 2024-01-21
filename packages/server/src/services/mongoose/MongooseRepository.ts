import { MongooseModel } from "@tsed/mongoose";
import type { FilterQuery } from "mongoose";

import {HistoryBaseModel} from "../../models/common/BaseModel.ts";

export abstract class MongooseRepository<T extends HistoryBaseModel> {
  protected abstract model: MongooseModel<T>;

  isMongoId(text: string) {
    return text.toString().match(/^[0-9a-fA-F]{24}$/);
  }

  async get(id: string) {
    return this.model.findById(id);
  }

  async save(data: T) {
    const instance = new this.model(data);
    instance.updatedAt = Date.now();

    await this.model.updateOne({ _id: instance._id }, { $set: instance }, { upsert: true });

    return (await this.get(instance._id as never))!;
  }

  async remove(id: string) {
    await this.model.deleteOne({ _id: id } as never);
  }

  find(query?: FilterQuery<T>) {
    return this.model.find(query as never).exec();
  }

  findOne(query?: FilterQuery<T>) {
    return this.model.findOne(query as never).exec();
  }

  async count() {
    return this.model.countDocuments();
  }
  async isEmpty() {
    return !(await this.count());
  }
}
