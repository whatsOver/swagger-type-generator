import { API } from "@src/pages/content/modules/getAPIList";
import {
  DefaultComplexSchema,
  Schemas,
  SwaggerDocs,
} from "@src/pages/popup/api/docs";
import { RequestProps } from "@src/pages/popup/ui/Request";
import { Method } from "axios";

const convertSelectedAPI = (
  data: SwaggerDocs,
  api: API
): Omit<RequestProps, "host"> => {
  if (!data) return null;

  const method = api.method;
  const path = api.path;
  const description = api.description;
  const parameters =
    data.paths[path][method.toLowerCase() as Method].parameters;

  let schemaName = "";
  const requestBody =
    data.paths[api.path][method.toLowerCase() as Method].requestBody;
  let body = null;
  if (requestBody) {
    const schema = requestBody.content["application/json"].schema;
    if ("$ref" in schema) {
      schemaName = schema.$ref.split("/")[3];
      body = data.components.schemas[schemaName];
    }
    if ("type" in schema && schema.type === "array") {
      schemaName = schema.items.$ref.split("/")[3];
      body = data.components.schemas[schemaName];
    }
    if ("default" in schema) {
      console.log(schema);
      body = transformDefaultComplexSchema(schema);
    }
  }

  return {
    method,
    path,
    description,
    params: parameters,
    body,
  };
};

export { convertSelectedAPI };

function transformDefaultComplexSchema(schema: DefaultComplexSchema): Schemas {
  const required = Object.keys(schema.default);
  const properties: { [key: string]: any } = {};

  required.forEach((key) => {
    const value = schema.default[key];
    const type = Array.isArray(value) ? "array" : typeof value;
    properties[key] = { type, default: value };
  });

  return { type: "object", required, properties };
}
