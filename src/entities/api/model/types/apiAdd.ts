import {
  ContentType,
  SwaggerFormat,
  SwaggerType,
} from "@/entities/swagger/types";
import { Method } from "axios";

export interface Param {
  name: string;
  in: "query" | "path" | "header" | "cookie";
  description: string;
  required: boolean;
  type: SwaggerType;
  format?: SwaggerFormat;
}

export interface SimpleSchemaProperty {
  type: SwaggerType;
  format?: SwaggerFormat;
  description?: string;
  example?: string | number;
  items?: {
    type: SwaggerType;
    format?: SwaggerFormat;
  };
}

export interface SimpleSchema {
  type: "object" | "array";
  required?: string[];
  properties?: {
    [key: string]: SimpleSchemaProperty;
  };
  items?: SimpleSchemaProperty;
}

export interface RequestBodyInput {
  description?: string;
  required?: boolean;
  contentType: ContentType;
  schema: SimpleSchema;
}

export interface ResponseInput {
  description: string;
  contentType: ContentType;
  schema: SimpleSchema;
}

export interface EnhancedApiAdd {
  method: Method;
  path: string;
  summary: string;
  description: string;
  tags: string[];
  parameters: Param[];
  requestBody?: RequestBodyInput;
  responses: {
    [statusCode: string]: ResponseInput;
  };
}
