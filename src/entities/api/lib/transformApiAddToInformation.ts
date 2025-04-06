import {
  Information,
  Parameters,
  RequestBody,
  Schema,
  SchemasProperties,
} from "@/entities/swagger/types";
import {
  EnhancedApiAdd,
  Param as InputParam,
  SimpleSchema,
} from "../model/types/apiAdd";

// Renaming back and changing return type to Schema
const transformSimpleSchemaToSwaggerSchema = (
  simpleSchema: SimpleSchema,
  title = "GeneratedSchema"
): Schema => {
  if (simpleSchema.type === "object" && simpleSchema.properties) {
    const properties: { [key: string]: SchemasProperties } = {};
    for (const key in simpleSchema.properties) {
      const prop = simpleSchema.properties[key];
      properties[key] = {
        type: prop.type,
        format: prop.format,
        description: prop.description,
        example: prop.example,
        items: prop.items
          ? { type: prop.items.type, format: prop.items.format }
          : undefined,
      };
    }
    // Return object schema conforming to Schema interface
    return {
      title: title,
      type: "object",
      // Cast properties to match the specific structure in Schema interface
      properties: properties as Schema["properties"],
      required: simpleSchema.required,
    };
  } else if (simpleSchema.type === "array" && simpleSchema.items) {
    const itemsSchema: SchemasProperties = {
      type: simpleSchema.items.type,
      format: simpleSchema.items.format,
      description: simpleSchema.items.description,
      example: simpleSchema.items.example,
      items: simpleSchema.items.items
        ? {
            type: simpleSchema.items.items.type,
            format: simpleSchema.items.items.format,
          }
        : undefined,
    };
    // Construct the correct array schema structure according to OpenAPI spec
    const arraySchemaObject = {
      title: title,
      type: "array",
      items: itemsSchema,
    };
    // Use double assertion (as unknown as Schema) to satisfy stricter type checking
    return arraySchemaObject as unknown as Schema;
  }

  console.warn("Unsupported or incomplete SimpleSchema:", simpleSchema);
  // Fallback Schema
  return {
    title: "FallbackSchema",
    type: "object",
    // Ensure fallback matches Schema interface (needs properties)
    properties: {},
    // required?: [], // Optionally add empty required array
  };
};

// Helper function to transform InputParam to Swagger Parameters
const transformInputParamToSwaggerParameter = (
  inputParam: InputParam
): Parameters => {
  return {
    name: inputParam.name,
    in: inputParam.in,
    description: inputParam.description,
    required: inputParam.required,
    schema: {
      type: inputParam.type,
      format: inputParam.format,
    },
  };
};

// Main adapter function
export const transformApiAddToInformation = (
  apiAddData: EnhancedApiAdd
): Information => {
  // Transform parameters
  const parameters: Parameters[] = apiAddData.parameters.map(
    transformInputParamToSwaggerParameter
  );

  // Transform requestBody
  let requestBody: RequestBody | undefined = undefined;
  if (apiAddData.requestBody) {
    const reqBodyInput = apiAddData.requestBody;
    const schema: Schema = transformSimpleSchemaToSwaggerSchema(
      reqBodyInput.schema,
      `${apiAddData.summary}RequestBody`
    );
    requestBody = {
      required: reqBodyInput.required,
      content: {
        [reqBodyInput.contentType]: {
          schema: schema,
        },
      },
    };
  }

  // Transform responses
  const responses: Information["responses"] = {};
  for (const statusCode in apiAddData.responses) {
    const resInput = apiAddData.responses[statusCode];
    const schema: Schema = transformSimpleSchemaToSwaggerSchema(
      resInput.schema,
      `${apiAddData.summary}Response${statusCode}`
    );
    responses[statusCode] = {
      description: resInput.description,
      content: {
        "application/json": {
          schema: schema,
        },
      },
    };
  }

  // Construct the Information object
  const information: Information = {
    tags: apiAddData.tags,
    summary: apiAddData.summary,
    description: apiAddData.description,
    operationId: `${apiAddData.method.toLowerCase()}${apiAddData.path.replace(
      /[/{}<>\s-]+/g,
      ""
    )}`,
    parameters: parameters,
    requestBody: requestBody,
    responses: responses,
  };

  return information;
};
