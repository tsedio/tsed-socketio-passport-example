import {Controller, Get, PathParams, QueryParams} from "@tsed/common";
import {Name, Returns, Summary} from "@tsed/schema";
import {getFormioSchema} from "@tsed/schema-formio";

@Controller("/formio")
@Name("Formio")
export class FormioSchemesController {
  @Get("/:alias")
  @Summary("Get schema for a model")
  @Returns(200, Object).ContentType("application/json").Header("Cache-Control", "no-cache, no-store, private, max-age=0")
  async getSchema(
    @PathParams("alias") alias: string,
    @QueryParams("groups", String) groups: string[]
  ) {
    const opts = {
      groups: [...(groups || []), "formio"],
      customKeys: true
    };

    return getFormioSchema(alias, opts);
  }
}
