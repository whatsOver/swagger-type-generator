import axios, { Method } from "axios";
import { useQuery } from "@tanstack/react-query";

export interface Parameters {
  name: string;
  in: string;
  description: string;
  example?: string | number;
  required: boolean;
  schema: {
    type: string;
    format?: string;
  };
}

interface RequestBody {
  content: {
    "application/json": {
      schema: RefSchema | RefArraySchema;
    };
  };
}

type RefSchema = {
  $ref: string;
};

type RefArraySchema = {
  type: "array";
  items: RefSchema;
};

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
      description?: string;
      example?: string | number;
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

const getSwaggerDocs = async (host: string): Promise<SwaggerDocs> => {
  const { data } = await axios.get(`${host}/api-docs`);
  return data;
};

const useGETDocs = (host: string) => {
  return useQuery(["getDocs", host], async () => await getSwaggerDocs(host), {
    enabled: !!host,
  });
};

export { useGETDocs };
