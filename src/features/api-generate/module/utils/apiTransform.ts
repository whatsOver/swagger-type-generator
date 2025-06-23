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
import { FormSchemaProperty } from "../hooks/useApiAddForm";

// $ref에서 타입 이름 추출하는 유틸리티 함수
const extractTypeNameFromRef = (ref: string): string => ref.split("/")[3];

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
      schemaName = extractTypeNameFromRef(schema.$ref);
      body = data.components.schemas[schemaName];
    }
    if (
      "type" in schema &&
      schema.type === "array" &&
      "items" in schema &&
      "$ref" in schema.items
    ) {
      schemaName = extractTypeNameFromRef(schema.items.$ref);
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
    const typeName = extractTypeNameFromRef(schema.$ref);
    const schemaData = components.schemas[typeName];

    const properties = schemaData?.properties || {};
    const processedProperties = processNestedProperties(properties, components);

    return {
      schema: schema.$ref,
      typeName,
      properties: processedProperties,
      required: schemaData?.required || [],
      type: schemaData?.type || "object",
    };
  }

  const properties = (schema as Schema).properties || {};
  const processedProperties = processNestedProperties(properties, components);

  return {
    schema: "inline",
    typeName: "inline",
    properties: processedProperties,
    required: (schema as Schema).required || [],
    type: (schema as Schema).type || "object",
  };
};

const processNestedProperties = (
  properties: Record<string, unknown>,
  components: SwaggerDocs["components"]
): Record<string, unknown> => {
  const processed: Record<string, unknown> = {};

  Object.entries(properties).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      const prop = value as FormSchemaProperty;

      if (prop.$ref) {
        const typeName = extractTypeNameFromRef(prop.$ref);
        const schemaData = components.schemas[typeName];

        if (schemaData?.properties) {
          const expandedProperties = processNestedProperties(
            schemaData.properties,
            components
          );

          processed[key] = {
            type: "object",
            properties: expandedProperties,
            required: schemaData.required || [],
            $ref: prop.$ref,
          };
        } else {
          processed[key] = value;
        }
      } else if (prop.type === "array" && prop.items) {
        const processedItems = processArrayItems(prop.items, components);
        processed[key] = {
          ...prop,
          items: processedItems,
        };
      } else {
        processed[key] = value;
      }
    } else {
      processed[key] = value;
    }
  });

  return processed;
};

const processArrayItems = (
  items: unknown,
  components: SwaggerDocs["components"]
): unknown => {
  if (typeof items === "object" && items !== null) {
    const itemProp = items as FormSchemaProperty;

    if (itemProp.$ref) {
      const typeName = extractTypeNameFromRef(itemProp.$ref);
      const schemaData = components.schemas[typeName];

      if (schemaData?.properties) {
        const expandedProperties = processNestedProperties(
          schemaData.properties,
          components
        );

        return {
          type: "object",
          properties: expandedProperties,
          required: schemaData.required || [],
          $ref: itemProp.$ref,
        };
      }
    }
  }

  return items;
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
