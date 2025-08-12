import {
  ContentType,
  DetailSchema,
  Information,
  Parameters,
  Schemas,
  SwaggerDocs,
} from "@/entities/swagger/types";
import { Method } from "axios";

declare global {
  interface Window {
    swaggerOptions?: {
      swaggerDoc: string | { url: string };
    };
  }
}

export type POST_API_LIST = {
  type: "GET_API_LIST_RESULT";
  data: {
    prList: ApiListType;
    path: Path;
    script: string;
  };
};

export type GET_API_LIST_RESULT = {
  type: "GET_API_LIST_RESULT";
  prList: ApiListType;
  path: Path;
};

export interface ApiListType {
  tags: string[];
  endpoints: Endpoints;
}

export interface Path {
  href: string;
  host: string;
}

export interface Endpoints {
  [key: string]: API[];
}

export interface API {
  method: Method;
  path: string;
  summary: string;
  description: string;
  detailSchema?: DetailSchema;
}

export interface APIWithParamsOrBody extends API {
  method: Method;
  endpoint: string;
  contentType: ContentType;
  params?: Parameters[];
  body?: Schemas;
  detailSchema?: DetailSchema;
  components?: SwaggerDocs["components"];
}

export interface APIWithParamsAndBodyAndHost extends APIWithParamsOrBody {
  host: string;
}

export interface BrowserSwaggerDocs {
  data: any;
  href: string;
}

export interface DocItem {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  color: string;
  swaggerDocs: SwaggerDocs;
}

export interface DocsStorageState {
  docsList: DocItem[];
}

export interface PathInfo {
  path: string;
  method: Method;
  information: Information;
}
