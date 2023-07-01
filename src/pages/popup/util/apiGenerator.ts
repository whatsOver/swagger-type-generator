import { Method } from "axios";
import { Parameters, Schemas } from "../api/docs";
import { getParams } from "./request";
import { typeConverter } from "./typeConverter";
import { toTsType } from "@src/common/util/typeGenerator";

const generateInterface = (
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
        .map((key) => `    ${key}: ${toTsType(body.properties[key].example)};`)
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

interface GenerateAPICodeProps {
  api: {
    method: string;
    host: string;
    path: string;
    params: Parameters[];
    body: Schemas | null;
  };
  rootInterfaceKey?: string;
}

const generateAxiosAPICode = ({
  api,
  rootInterfaceKey,
}: GenerateAPICodeProps): string => {
  const interfaceName = "RequestInterface";
  const { method, host, path, params, body } = api;

  const args = params ? getParams(params) : "";
  const bodyArgs = body
    ? `${args.length > 0 ? `${args}, ` : ""}${method}Data`
    : args;

  const parameters = bodyArgs.length > 0 ? `${bodyArgs}, token` : "token";

  const axiosData = body ? `${method}Data` : "{}";

  const responseInterface = rootInterfaceKey
    ? rootInterfaceKey === "Json"
      ? `<${rootInterfaceKey}>`
      : `<${rootInterfaceKey}[]>`
    : "";

  const apiFunction = `
const ${method.toLowerCase()}API = async ({ ${parameters} }: ${interfaceName}) => {
  const { data } = await axios${responseInterface}({
    method: "${method}",
    url: "${host}${path}",
    params: { ${args} },
    data: ${axiosData},
    headers: token ? { 'Authorization': \`Bearer \${token}\` } : {}
  });
  return data;
};`;

  return apiFunction;
};

const objectToQueryString = (params: string): string => {
  if (!params) return "";

  return params
    .split(", ")
    .map((param) => `${param}=\${${param}}`)
    .join("&");
};

const generateFetchAPICode = ({
  api,
  rootInterfaceKey,
}: GenerateAPICodeProps): string => {
  const interfaceName = "RequestInterface";
  const { method, host, path, params = [], body } = api;

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

  const fetchBody = body ? `${method}Data` : "{}";

  const apiFunction = `
const ${method.toLowerCase()}API = async ({ ${parameters} }: ${interfaceName}): Promise${responseInterface} => {
  ${queryParams.length ? `const query = ${fetchParams};` : ""}
  const headers = token ? { 'Authorization': \`Bearer \${token}\`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  const response = await fetch(\`${host}${dynamicPath}\` + ${
    queryParams.length ? "query" : '""'
  }, {
    method: "${method}",
    ${
      method.toLowerCase() !== "get" && body
        ? `body: JSON.stringify(${fetchBody}), headers: headers`
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

export {
  generateInterface,
  generateAxiosAPICode,
  generateFetchAPICode,
  objectToQueryString,
};
