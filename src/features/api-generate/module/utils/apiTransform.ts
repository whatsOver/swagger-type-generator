import { API, APIWithParamsOrBody } from "@/entities/docs/model/types/docs";
import {
  ContentType,
  DefaultComplexSchema,
  DetailSchema,
  Information,
  RefArraySchema,
  RefSchema,
  Schema,
  SchemaInfo,
  Schemas,
  SwaggerDocs,
} from "@/entities/swagger/types";
import { Method } from "axios";

export const transformApiFromSwagger = (
  data: SwaggerDocs,
  api: API
): APIWithParamsOrBody => {
  if (!data) return null;
  if (!api) return null;

  const method = api.method;
  const path = api.path;
  const summary = api.summary;
  const description = api.description;
  const parameters =
    data.paths[path][method.toLowerCase() as Method]?.parameters;
  let schemaName = "";
  const requestBody =
    data.paths[api.path][method.toLowerCase() as Method]?.requestBody;
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

  const detailSchema = extractTypeSchemaInfo(data, api);

  return {
    endpoint: `${method} ${path}`,
    method,
    path,
    description,
    summary,
    params: parameters,
    body,
    contentType,
    detailSchema,
  };
};

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

const extractSchemaInfo = (
  schema: RefSchema | RefArraySchema | DefaultComplexSchema | Schema,
  components: SwaggerDocs["components"]
): SchemaInfo => {
  if ("$ref" in schema) {
    const typeName = schema.$ref.split("/")[3];
    const schemaData = components.schemas[typeName];

    return {
      schema: schema.$ref,
      typeName,
      properties: schemaData?.properties || {},
      required: schemaData?.required || [],
      type: schemaData?.type || "object",
    };
  }

  return {
    schema: "inline",
    typeName: "inline",
    properties: (schema as Schema).properties || {},
    required: (schema as Schema).required || [],
    type: (schema as Schema).type || "object",
  };
};

const extractRequestType = (
  methodData: Information,
  components: SwaggerDocs["components"]
): SchemaInfo | null => {
  const requestBody = methodData?.requestBody;
  if (!requestBody) return null;

  const contentType = Object.keys(requestBody.content)[0] as ContentType;
  const schema = requestBody.content[contentType]?.schema;
  if (!schema) return null;

  return extractSchemaInfo(schema, components);
};

const extractResponseType = (
  methodData: Information,
  components: SwaggerDocs["components"]
): SchemaInfo | null => {
  const responses = methodData?.responses;
  if (!responses) return null;

  const successResponse =
    responses["200"] || responses["201"] || responses["202"];
  if (!successResponse?.content) return null;

  const contentType = Object.keys(successResponse.content)[0] as ContentType;
  const schema = successResponse.content[contentType]?.schema;
  if (!schema) return null;

  return extractSchemaInfo(schema, components);
};

// reqeust, response Schema 추출
const extractTypeSchemaInfo = (data: SwaggerDocs, api: API): DetailSchema => {
  const pathData = data.paths[api.path];
  const methodData = pathData[api.method.toLowerCase() as Method];

  return {
    requestType: extractRequestType(methodData, data.components),
    responseType: extractResponseType(methodData, data.components),
  };
};
