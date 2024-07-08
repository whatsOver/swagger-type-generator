import { Method } from "axios";

import { getBodyProPertyType } from "@/shared/util/typeGenerator";
import {
  ContentType,
  Parameters,
  Schemas,
} from "../../../pages/popup/shared/api/docs";
import {
  getParams,
  getQueryParamsArray,
} from "../../../pages/popup/shared/util/request";
import { typeConverter } from "../../../pages/popup/shared/util/typeConverter";

export const generateInterface = (
  params: Parameters[],
  body?: Schemas,
  method?: Method
): string => {
  const interfaceItems = params
    ? params
        .filter((param) => param.in !== "body")
        .map((param) => `  ${param.name}: ${typeConverter(param.schema.type)};`)
        .join("\n")
    : "";

  const postData = body
    ? Object.keys(body.properties)
        .map(
          (key) => `    ${key}: ${getBodyProPertyType(body.properties[key])};`
        )
        .join("\n")
    : "";

  const postDataInterface = postData
    ? `  ${method}Data: {\n${postData}\n  };\n`
    : "";

  const interfaceName = "RequestInterface";

  // token이 필요한 경우에만 token interface를 추가
  const tokenLine = interfaceItems.length
    ? `\n  token?: string;\n`
    : `  token?: string;\n`;

  return `interface ${interfaceName} {\n${interfaceItems}${postDataInterface}${tokenLine}}`;
};

export const generateFormDataCode = (
  contentType: ContentType,
  method: string
) => {
  const formDataCode =
    contentType === "multipart/form-data"
      ? `const formData = new FormData();
Object.entries(${method}Data).forEach(([key, value]) => {
  if (Array.isArray(value)) {
    value.forEach(item => formData.append(key, item));
  } else {
    formData.append(key, value);
  }
});`
      : "";
  return formDataCode;
};

export interface GenerateAPICodeProps {
  api: {
    method: string;
    host: string;
    path: string;
    params: Parameters[];
    body: Schemas | null;
    contentType: ContentType;
  };
  rootInterfaceKey?: string;
}

export const generateAxiosAPICode = ({
  api,
  rootInterfaceKey,
}: GenerateAPICodeProps): string => {
  const interfaceName = "RequestInterface";
  const { method, host, path, params, body, contentType } = api;

  const args = params ? getParams(params) : "";
  const bodyArgs = body
    ? `${args.length > 0 ? `${args}, ` : ""}${method}Data`
    : args;

  // path에 있는 {param}을 ${param}으로 변경
  const dynamicPath = path.replace(/{/g, "${");

  const parameters = bodyArgs.length > 0 ? `${bodyArgs}, token` : "token";

  const responseInterface = rootInterfaceKey
    ? rootInterfaceKey === "Json"
      ? `<${rootInterfaceKey}>`
      : `<${rootInterfaceKey}[]>`
    : "";

  const axiosData = body
    ? contentType === "multipart/form-data"
      ? "formData"
      : `${method}Data`
    : "{}";

  const headers = `token ? { 'Authorization': \`Bearer \${token}\`, 'Content-Type': '${contentType}' } : { 'Content-Type': '${contentType}' }`;

  const url = `\`${host}${dynamicPath}\``;
  const paramsCode =
    params && params.length
      ? `params: { ${getQueryParamsArray(params)} },\n    `
      : "";

  const dataCode = body ? `data: ${axiosData},\n    ` : "";

  const apiFunction = `
const ${method.toLowerCase()}API = async ({ ${parameters} }: ${interfaceName}) => {
  ${generateFormDataCode(contentType, method)}
  const { data } = await axios${responseInterface}({
    method: "${method}",
    url: ${url},
    ${paramsCode}${dataCode}headers: ${headers},
  });
  return data;
};`;

  return apiFunction;
};

export const objectToQueryString = (params: string): string => {
  if (!params) return "";

  return params
    .split(", ")
    .map((param) => `${param}=\${${param}}`)
    .join("&");
};

export const generateFetchAPICode = ({
  api,
  rootInterfaceKey,
}: GenerateAPICodeProps): string => {
  const interfaceName = "RequestInterface";
  const { method, host, path, params = [], body, contentType } = api;

  const queryParams = params
    ? params.filter((param) => param.in === "query").map((param) => param.name)
    : [];
  const pathParams = params
    ? params.filter((param) => param.in === "path").map((param) => param.name)
    : [];

  const args = [...pathParams, ...queryParams];
  const bodyArgs = body ? args.concat(`${method}Data`) : args;
  const parameters = bodyArgs.length > 0 ? `${bodyArgs}, token` : "token";

  const dynamicPath = pathParams.reduce(
    (accPath, param) => accPath.replace(`{${param}}`, `\${${param}}`),
    path
  );

  const responseInterface = rootInterfaceKey
    ? rootInterfaceKey === "Json"
      ? `<${rootInterfaceKey}>`
      : `<${rootInterfaceKey}[]>`
    : "";

  const fetchParams = queryParams.length
    ? `\`?${objectToQueryString(queryParams.join(", "))}\``
    : "";

  const fetchBody = body
    ? contentType === "multipart/form-data"
      ? "formData"
      : `${method}Data`
    : "{}";

  const apiFunction = `
const ${method.toLowerCase()}API = async ({ ${parameters} }: ${interfaceName}): Promise${responseInterface} => {
  ${generateFormDataCode(contentType, method)}
  ${queryParams.length ? `const query = ${fetchParams};` : ""}
  const headers = token ? { 'Authorization': \`Bearer \${token}\`, 'Content-Type': '${contentType}' } : { 'Content-Type': '${contentType}' };
  const response = await fetch(\`${host}${dynamicPath}\` + ${
    queryParams.length ? "query" : '""'
  }, {
    method: "${method}",
    ${
      method.toLowerCase() !== "get" && body
        ? `body: JSON.stringify(${fetchBody}),\n    headers: headers`
        : `headers: headers`
    }
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }

  return response.json() as Promise${responseInterface};
};`;

  return apiFunction;
};

export interface Json {
  userId: string;
  username: string;
  email: string;
  avatar: string;
  password: string;
  birthDate: string;
  registeredAt: string;
}
