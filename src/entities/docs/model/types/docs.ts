import { ContentType, Parameters, Schemas } from "@/entities/swagger/types";
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
    prList: ApiList;
    path: Path;
    script: string;
  };
};

export type GET_API_LIST_RESULT = {
  type: "GET_API_LIST_RESULT";
  prList: ApiList;
  path: Path;
};

export interface ApiList {
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
}

export interface APIWithParamsOrBody extends API {
  method: Method;
  endpoint: string;
  contentType: ContentType;
  params?: Parameters[];
  body?: Schemas;
}

export interface APIWithParamsAndBodyAndHost extends APIWithParamsOrBody {
  host: string;
}

export interface SwaggerDocs {
  data: any;
  href: string;
}
