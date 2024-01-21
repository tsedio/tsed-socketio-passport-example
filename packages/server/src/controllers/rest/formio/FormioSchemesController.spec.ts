import { ApiKey, FormSchema } from "@clubmed/domain";
import { AuthTokenService, FormsClient, PermissionService } from "@clubmed/infra";
import { DataCompletionFormService } from "@clubmed/usecases";
import { PlatformTest } from "@tsed/common";
import { catchAsyncError, nameOf } from "@tsed/core";
import { NotFound } from "@tsed/exceptions";

import { FormioSchemesController } from "./FormioSchemesController";

async function getControllerFixture({ scopes = ["scope"], isAdmin = false } = {}) {
  const permissionService = {
    getScopes: jest.fn().mockReturnValue(scopes)
  };

  const formsClient = {
    getByName: jest.fn().mockResolvedValue(undefined),
    save: jest.fn().mockImplementation((o) => o),
    remove: jest.fn().mockResolvedValue(undefined)
  };

  const authTokenService = {
    claim: jest.fn().mockResolvedValue({
      permissions: ["clients:oidc"],
      isAdmin: jest.fn().mockReturnValue(isAdmin)
    })
  };

  const instance = await PlatformTest.invoke<FormioSchemesController>(FormioSchemesController, [
    {
      token: PermissionService,
      use: permissionService
    },
    {
      token: FormsClient,
      use: formsClient
    },
    {
      token: AuthTokenService,
      use: authTokenService
    }
  ]);

  return { instance, permissionService, formsClient };
}

describe("FormioFormioSchemesController", () => {
  beforeEach(() => PlatformTest.create({ cache: false }));
  afterEach(PlatformTest.reset);

  describe("getSchema", () => {
    it("should return OIDCClient Schema for creation", async () => {
      const { instance } = await getControllerFixture();

      // WHEN
      const result = await instance.getSchema("OIDCClient", ["create", "api_admin"]);

      // THEN
      expect(result).toMatchSnapshot();
    });
    it("should return ApiKey Schema with locales dataSources", async () => {
      const { instance } = await getControllerFixture({ scopes: ["api_admin"], isAdmin: true });

      // WHEN
      const result = await instance.getSchema(nameOf(ApiKey), []);

      // THEN
      expect(result).toMatchSnapshot();
    });
    it("should return the data completion form", async () => {
      const dataCompletionFormService = {
        getForm: jest.fn().mockReturnValue({ type: "form" })
      };
      const instance = await PlatformTest.invoke<FormioSchemesController>(FormioSchemesController, [
        {
          token: DataCompletionFormService,
          use: dataCompletionFormService
        },
        {
          token: AuthTokenService,
          use: {
            claim: jest.fn().mockResolvedValue({
              permissions: [],
              isAdmin: jest.fn().mockReturnValue(true)
            })
          }
        }
      ]);

      // WHEN
      const result = await instance.getSchema("DataCompletionRules", [], undefined, undefined, undefined, undefined, "routeId");

      // THEN
      expect(result).toEqual({ type: "form", permissions: ["api_admin"] });
      expect(dataCompletionFormService.getForm).toHaveBeenCalledWith("routeId", "production");
    });
    it("should return schema from database", async () => {
      const { instance, formsClient } = await getControllerFixture();
      const form = new FormSchema();
      form.name = "my_model";

      formsClient.getByName.mockReturnValue(form);

      // WHEN
      const result = await instance.getSchema("my_model", []);

      // THEN
      expect(result).toEqual(form);
    });
    it("should throw not found if model not found", async () => {
      const { instance } = await getControllerFixture();

      // WHEN
      let actualError;
      try {
        await instance.getSchema("ModelNotFound", ["create"]);
      } catch (err) {
        actualError = err;
      }

      // THEN
      expect(actualError).toBeInstanceOf(NotFound);
    });
    it("should merge form with another with on", async () => {
      const { instance } = await getControllerFixture();

      // WHEN
      const result = await instance.getSchema("quable_event", ["create", "api_admin"], undefined, undefined, "ApiConfig", "properties");

      // THEN
      expect(result).toMatchInlineSnapshot(`
        {
          "access": [],
          "components": [
            {
              "calculateValue": "value = _.snakeCase(value)",
              "description": "The unique configuration ID in the ClubMed API",
              "disabled": false,
              "input": true,
              "key": "id",
              "label": "Id:",
              "tableView": true,
              "type": "textfield",
              "validate": {
                "required": true,
              },
            },
            {
              "description": "Fill a description to explain the configuration usage in the ClubMed API",
              "disabled": false,
              "input": true,
              "key": "description",
              "label": "Description:",
              "tableView": false,
              "type": "textfield",
              "validate": {
                "required": true,
              },
            },
            {
              "components": [
                {
                  "disabled": false,
                  "input": true,
                  "key": "active",
                  "label": "Is active configuration:",
                  "type": "checkbox",
                  "validate": {
                    "required": false,
                  },
                },
                {
                  "data": {
                    "url": "/locales?include_wildcard=true",
                  },
                  "dataSrc": "url",
                  "disabled": false,
                  "idPath": "id",
                  "input": true,
                  "key": "locales_active",
                  "label": "Locales active:",
                  "multiple": true,
                  "selectThreshold": 0.3,
                  "template": "<span class="choices__item-template">{{item.id}}<small>{{item.businessUnit == "*" ? "include all locales" : item.businessUnit}}</small></span>",
                  "type": "select",
                  "validate": {
                    "min": 1,
                    "required": true,
                  },
                  "valueProperty": "id",
                  "widget": "choicesjs",
                },
                {
                  "components": [
                    {
                      "disabled": false,
                      "key": "day",
                      "label": "Day:",
                      "type": "radio",
                      "validate": {
                        "required": true,
                      },
                      "values": [
                        {
                          "label": "MONDAY",
                          "shortcut": "",
                          "value": "MONDAY",
                        },
                        {
                          "label": "TUESDAY",
                          "shortcut": "",
                          "value": "TUESDAY",
                        },
                        {
                          "label": "WEDNESDAY",
                          "shortcut": "",
                          "value": "WEDNESDAY",
                        },
                        {
                          "label": "THURSDAY",
                          "shortcut": "",
                          "value": "THURSDAY",
                        },
                        {
                          "label": "FRIDAY",
                          "shortcut": "",
                          "value": "FRIDAY",
                        },
                        {
                          "label": "SATURDAY",
                          "shortcut": "",
                          "value": "SATURDAY",
                        },
                        {
                          "label": "SUNDAY",
                          "shortcut": "",
                          "value": "SUNDAY",
                        },
                      ],
                    },
                    {
                      "components": [
                        {
                          "disabled": false,
                          "format": "HH:mm:ss",
                          "input": true,
                          "inputMask": "99:99:99",
                          "key": "opening_hour",
                          "label": "Opening hour:",
                          "type": "time",
                          "validate": {
                            "required": false,
                          },
                        },
                        {
                          "disabled": false,
                          "format": "HH:mm:ss",
                          "input": true,
                          "inputMask": "99:99:99",
                          "key": "closing_hour",
                          "label": "Closing hour:",
                          "type": "time",
                          "validate": {
                            "required": false,
                          },
                        },
                      ],
                      "disabled": false,
                      "input": true,
                      "key": "business_hours",
                      "label": "Business hours:",
                      "rowDrafts": false,
                      "type": "editgrid",
                      "validate": {
                        "required": true,
                      },
                    },
                  ],
                  "disabled": false,
                  "input": true,
                  "key": "weekdays",
                  "label": "Weekdays:",
                  "rowDrafts": false,
                  "type": "editgrid",
                  "validate": {
                    "min": 1,
                    "required": true,
                  },
                },
              ],
              "customClass": "p-5 pt-4 border-1 border-gray-200 rounded-small",
              "hideLabel": false,
              "input": true,
              "key": "properties",
              "label": "Properties",
              "tableView": false,
              "type": "container",
            },
          ],
          "display": "form",
          "machineName": "api-config",
          "name": "api-config",
          "permissions": [
            "clients:oidc",
            "authenticated",
          ],
          "submissionAccess": [],
          "tags": [],
          "title": "ApiConfig",
          "type": "form",
        }
      `);
    });
    it("should fallback to default merge_with given model if alias doesn't exists", async () => {
      const { instance } = await getControllerFixture();

      // WHEN
      const result = await instance.getSchema("unknown", ["create", "api_admin"], undefined, undefined, "ApiConfig", "properties");

      // THEN
      expect(result).toMatchInlineSnapshot(`
        {
          "access": [],
          "components": [
            {
              "calculateValue": "value = _.snakeCase(value)",
              "description": "The unique configuration ID in the ClubMed API",
              "disabled": false,
              "input": true,
              "key": "id",
              "label": "Id:",
              "tableView": true,
              "type": "textfield",
              "validate": {
                "required": true,
              },
            },
            {
              "description": "Fill a description to explain the configuration usage in the ClubMed API",
              "disabled": false,
              "input": true,
              "key": "description",
              "label": "Description:",
              "tableView": false,
              "type": "textfield",
              "validate": {
                "required": true,
              },
            },
            {
              "disabled": false,
              "input": true,
              "key": "properties",
              "label": "Properties",
              "tableView": false,
              "type": "datamap",
              "validate": {
                "required": false,
              },
              "valueComponent": {
                "hideLabel": true,
                "tableView": true,
              },
            },
          ],
          "display": "form",
          "machineName": "api-config",
          "name": "api-config",
          "permissions": [
            "clients:oidc",
            "authenticated",
          ],
          "submissionAccess": [],
          "tags": [],
          "title": "ApiConfig",
          "type": "form",
        }
      `);
    });
  });
  describe("createSchema()", () => {
    it("should create schema", async () => {
      const { instance } = await getControllerFixture();

      const form = new FormSchema();
      form.name = "test";

      // WHEN
      const result = await instance.createSchema(form);

      // THEN
      expect(result).toEqual(form);
    });
    it("should throw error if the name is already used by a schema", async () => {
      const { instance, formsClient } = await getControllerFixture();

      formsClient.getByName.mockResolvedValue(new FormSchema());

      const form = new FormSchema();
      form.name = "test";

      // WHEN
      const error = await catchAsyncError(() => instance.createSchema(form));

      // THEN
      expect(error.message).toEqual("Form name already exists");
    });
  });
  describe("updateSchema()", () => {
    it("should update schema", async () => {
      const { instance, formsClient } = await getControllerFixture();
      formsClient.getByName.mockResolvedValue(new FormSchema());

      const form = new FormSchema();
      form.name = "test";

      // WHEN
      const result = await instance.updateSchema("test", form);

      // THEN
      expect(result).toEqual(form);
    });
    it("should throw error if the name doesn't exists", async () => {
      const { instance } = await getControllerFixture();

      const form = new FormSchema();
      form.name = "test";

      // WHEN
      const error = await catchAsyncError(() => instance.updateSchema("test", form));

      // THEN
      expect(error.message).toEqual("Form name not found");
    });
  });
  describe("deleteSchema()", () => {
    it("should delete schema", async () => {
      const { instance, formsClient } = await getControllerFixture();
      const form = new FormSchema();
      form._id = "id";

      formsClient.getByName.mockResolvedValue(form);

      // WHEN
      await instance.deleteSchema("test");

      // THEN
      expect(formsClient.getByName).toHaveBeenCalledWith("test");
      expect(formsClient.remove).toHaveBeenCalledWith("id");
    });
    it("should throw error if the name doesn't exists", async () => {
      const { instance } = await getControllerFixture();

      const form = new FormSchema();
      form.name = "test";

      // WHEN
      const error = await catchAsyncError(() => instance.deleteSchema("test"));

      // THEN
      expect(error.message).toEqual("Form name not found");
    });
  });
});
