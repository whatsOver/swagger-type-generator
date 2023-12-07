import axios, { Method } from "axios";
import { useQuery } from "@tanstack/react-query";
import { Path } from "@src/pages/content/modules/getAPIList";

export type SwaggerType =
  | "integer"
  | "number"
  | "string"
  | "boolean"
  | "array"
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

interface RequestBody {
  content: {
    [key in ContentType]?: {
      schema: RefSchema | RefArraySchema | DefaultComplexSchema | Schema;
    };
  };
  required?: boolean;
}

type RefSchema = {
  $ref: string;
};

interface Schema {
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

export interface Schemas {
  type: string;
  description?: string;
  required?: string[];
  properties: {
    [key: string]: SchemasProperties;
  };
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

const getSwaggerDocs = async ({ host, href }: Path): Promise<SwaggerDocs> => {
  const isFullUrl = href.includes("http");
  const { data } = await axios.get(isFullUrl ? href : `${host}${href}`);
  return data;
};

const getSwaggerDocsFromPage = async (): Promise<SwaggerDocs> => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { message: "GET_SWAGGER_DOCS" },
        (response) => {
          if (chrome.runtime.lastError) {
            // console.log(chrome.runtime.lastError);
            // setTimeout(() => getSwaggerDocsFromPage(), 1000);
          } else {
            resolve(response.data);
          }
        }
      );
    });
    // TODO : 리펙토링 하기
    chrome.tabs.query({ active: true, currentWindow: false }, (tabs) => {
      tabs.forEach((tab) =>
        chrome.tabs.sendMessage(
          tab.id,
          { message: "GET_SWAGGER_DOCS" },
          (response) => {
            if (chrome.runtime.lastError) {
              // console.log(chrome.runtime.lastError);
              // setTimeout(() => getSwaggerDocsFromPage(), 1000);
            } else {
              resolve(response.data);
            }
          }
        )
      );
    });
  });
};

const useGETDocs = ({ host, href }: Path) => {
  if (!href) {
    return useQuery(
      ["getDocs", href],
      async () => await getSwaggerDocsFromPage()
    );
  }

  return useQuery(
    ["getDocs", href],
    async () => await getSwaggerDocs({ host, href }),
    {
      enabled: !!href,
    }
  );
};

export { useGETDocs };
