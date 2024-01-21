import {Controller} from "@tsed/di";
import {Get, Hidden, Returns} from "@tsed/schema";
import {getFormioSchema} from "@tsed/schema-formio";
import {Vite} from "@tsed/vite-ssr-plugin";

@Hidden()
@Controller("/")
export class SignupController {
  @Get("/signup")
  @Vite()
  @Returns(200, String).ContentType("text/html")
  async signup() {
    return {
      form: await getFormioSchema("User", {
        useAlias: true,
        groups: [
          "create"
        ]
      })
    };
  }
}
