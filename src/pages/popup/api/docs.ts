import axios, { Method } from "axios";
import { useQuery } from "@tanstack/react-query";
import { Path } from "@src/pages/content/modules/getAPIList";

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
            console.log(chrome.runtime.lastError);
            setTimeout(() => getSwaggerDocsFromPage(), 1000);
          } else {
            resolve(response.data);
          }
        }
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
