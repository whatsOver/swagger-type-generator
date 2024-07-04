import { Method } from "axios";

export type SwaggerType =
  | "integer"
  | "number"
  | "string"
  | "boolean"
  | "array"
  | "object"
  | "binary";

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

export interface Schema {
  title: string;
  type: string;
  properties: {
    [key: string]: {
      title: string;
      type: string;
      items?: {
        type: string;
        format?: string;
      };
      example?: string | number;
      default?: string | number;
    };
  };
  required?: string[];
}

export interface SchemasProperties {
  type: SwaggerType;
  format?: SwaggerFormat;
  description?: string;
  example?: string | number;
  default?: string | number;
  title?: string;
  items?: {
    type: SwaggerType;
    format?: SwaggerFormat;
  };
}

export interface Schemas {
  type: string;
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

type RefSchema = {
  $ref: string;
};

type RefArraySchema = {
  type: "array";
  items: RefSchema;
};

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
