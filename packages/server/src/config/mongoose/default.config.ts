import {MongooseConnectionOptions} from "@tsed/mongoose";

export default {
  id: "default",
  url: String(process.env.MONGO_URL),
  connectionOptions: {
    maxPoolSize: process.env.MONGO_MAX_POOL_SIZE ? Number(process.env.MONGO_MAX_POOL_SIZE) : 100,
  }
} satisfies MongooseConnectionOptions;
