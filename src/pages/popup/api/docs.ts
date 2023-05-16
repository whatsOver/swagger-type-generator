import axios, { Method } from "axios";
import { useQuery } from "@tanstack/react-query";

export interface Parameters {
  name: string;
  in: string;
  description: string;
  example?: string;
  required: boolean;
  schema: {
    type: string;
  };
}

interface RequestBody {
  content: {
    "application/json": {
      schema: {
        $ref: string;
      };
    };
  };
}

export interface Information {
  tags: string[];
  summary: string;
  operationId: string;
  parameters: Parameters[];
  requestBody: RequestBody;
}

export interface Schemas {
  type: string;
  description?: string;
  required?: string[];
  properties: {
    [key: string]: {
      type: string;
      format?: string;
    };
  };
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
      [key in Method]: Information;
    };
  };
}

const getSwaggerDocs = async (): Promise<SwaggerDocs> => {
  const { data } = await axios.get("http://localhost:8080/api-docs");
  return data;
};

const useGETDocs = () => {
  return useQuery(["getDocs"], async () => await getSwaggerDocs(), {});
};

export { useGETDocs };
