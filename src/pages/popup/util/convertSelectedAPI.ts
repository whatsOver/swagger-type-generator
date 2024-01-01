import { API } from "@src/pages/content/modules/getAPIList";
import {
  ContentType,
  DefaultComplexSchema,
  Schemas,
  SwaggerDocs,
} from "@src/pages/popup/api/docs";
import { RequestProps } from "@src/pages/popup/pages/Request/Request";
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
  let contentType: ContentType = "application/json";

  if (requestBody) {
    contentType = Object.keys(requestBody.content)[0] as ContentType;
    const schema = requestBody.content[contentType].schema;
    if ("$ref" in schema) {
      schemaName = schema.$ref.split("/")[3];
      body = data.components.schemas[schemaName];
    }
    if (
      "type" in schema &&
      schema.type === "array" &&
      "items" in schema &&
      "$ref" in schema.items
    ) {
      schemaName = schema.items.$ref.split("/")[3];
      body = data.components.schemas[schemaName];
    }
    if ("default" in schema) {
      body = transformDefaultComplexSchema(schema);
    }
    if ("properties" in schema) {
      body = schema;
    }
  }

  return {
    method,
    path,
    description,
    params: parameters,
    body,
    contentType,
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
