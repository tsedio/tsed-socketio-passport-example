import { dirname } from "path";

export default {
  enableStream: true,
  root: dirname(require.resolve("@tsed/app"))
};
