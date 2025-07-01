import { Method } from "axios";

export type SwaggerType =
  | "integer"
  | "number"
  | "string"
  | "boolean"
  | "array"
  | "object"
  | "binary"
  | "object";

export type SwaggerFormat =
  | "int32"
  | "int64"
  | "float"
  | "double"
  | "byte"
  | "binary"
  | "date"
  | "date-time"
  | "password";

export type RefSchema = {
  $ref: string;
};

export type RefArraySchema = {
  type: "array";
  items: RefSchema;
};

export interface SchemaInfo {
  schema: string;
  typeName?: string;
  properties?: Record<string, SchemasProperties>;
  required?: string[];
  type: SwaggerType;
}

export interface DetailSchema {
  requestType: SchemaInfo | null;
  responseType: SchemaInfo | null;
}

export interface Schema {
  title: string;
  type: SwaggerType;
  properties: Record<string, SchemasProperties>;
  required?: string[];
}

export interface SchemasProperties {
  type: SwaggerType;
  format?: SwaggerFormat;
  additionalProperties?: SchemasProperties;
  description?: string;
  example?: string | number | string[] | number[] | boolean | unknown[];
  default?: string | number;
  title?: string;
  items?: SchemasProperties;
  enum?: string[] | number[];
  required?: boolean | string[];
  properties?: Record<string, SchemasProperties>;
  $ref?: string;
  oneOf?: SchemasProperties[];
  anyOf?: SchemasProperties[];
}

export interface Schemas {
  type: SwaggerType;
  description?: string;
  required?: string[];
  properties: {
    [key: string]: SchemasProperties;
  };
}

export interface Parameters {
  name: string;
  in: string;
  description: string;
  example?: string | number;
  required: boolean;
  schema: {
    default?: string | number;
    type: SwaggerType;
    format?: SwaggerFormat;
    items?: {
      type: SwaggerType;
      format?: SwaggerFormat;
    };
  };
}

export type ContentType =
  | "application/json"
  | "multipart/form-data"
  | "application/x-www-form-urlencoded"
  | "*/*";

export type DefaultComplexSchema = {
  title: string;
  default: {
    [key: string]: Array<{
      [key: string]: string | number;
    }>;
  };
};

export interface RequestBody {
  content: {
    [key in ContentType]?: {
      schema: RefSchema | RefArraySchema | DefaultComplexSchema | Schema;
    };
  };
  required?: boolean;
}

export interface Information {
  tags: string[];
  summary: string;
  operationId: string;
  parameters: Parameters[];
  requestBody?: RequestBody;
  responses: {
    [key: string]: {
      description: string;
      content: {
        "application/json": {
          schema: RefSchema | RefArraySchema | DefaultComplexSchema | Schema;
        };
      };
    };
  };
  description?: string;
  security?: { [key: string]: string[] }[];
}

export interface SwaggerDocs {
  components: {
    schemas: {
      [key: string]: Schemas;
    };
  };
  info: {
    title: string;
    version: string;
  };
  paths: {
    [key: string]: {
      [key in Method]?: Information;
    };
  };
}
