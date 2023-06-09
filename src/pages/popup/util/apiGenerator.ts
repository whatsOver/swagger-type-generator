import { Parameters, Schemas } from "../api/docs";
import { getBody, getParams, getQueryParams } from "./request";

const generateInterface = (params: Parameters[]): string => {
  const interfaceItems = params
    .filter((param) => param.in !== "body")
    .map((param) => `  ${param.name}: ${param.schema.type};`)
    .join("\n");

  const interfaceName = "RequestInterface";

  // token이 필요한 경우에만 token interface를 추가
  const tokenLine = interfaceItems
    ? `\n  token?: string;\n`
    : `  token?: string;\n`;

  return `interface ${interfaceName} {\n${interfaceItems}${tokenLine}}`;
};

interface GenerateAPICodeProps {
  api: {
    method: string;
    host: string;
    path: string;
    params: Parameters[];
    body: Schemas | null;
  };
  formValues: { [key: string]: string };
  rootInterfaceKey?: string;
}

const generateAxiosAPICode = ({
  api,
  formValues,
  rootInterfaceKey,
}: GenerateAPICodeProps): string => {
  const interfaceName = "RequestInterface";
  const { method, host, path, params, body } = api;

  const args = getParams(params);
  const parameters = args.length > 0 ? `${args}, token` : "token";

  const axiosData = JSON.stringify(body ? getBody(body, formValues) : {});

  const responseInterface = rootInterfaceKey ? `<${rootInterfaceKey}>` : "";

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

const objectToQueryString = (obj: { [key: string]: string }): string =>
  Object.keys(obj)
    .map((key) => `${key}=` + `{${key}}`)
    .join("&");

const generateFetchAPICode = ({
  api,
  formValues,
}: GenerateAPICodeProps): string => {
  const interfaceName = "RequestInterface";
  const { method, host, path, params, body } = api;

  const args = params
    .filter((param) => param.in === "path" || param.in === "query")
    .map((param) => param.name)
    .join(", ");
  const parameters = args.length > 0 ? `${args}, token` : "token";

  const queryParams = params.filter((param) => param.in === "query");
  const pathParams = params.filter((param) => param.in === "path");

  const dynamicPath = pathParams.reduce(
    (accPath, param) => accPath.replace(`{${param.name}}`, `\${${param.name}}`),
    path
  );

  const fetchParams = queryParams.length
    ? `\`?${objectToQueryString(getQueryParams(queryParams, formValues))}\``
    : "";

  const fetchBody = JSON.stringify(body ? getBody(body, formValues) : {});

  const apiFunction = `
const ${method.toLowerCase()}API = async ({ ${parameters} }: ${interfaceName}) => {
  ${queryParams.length ? `const query = ${fetchParams};` : ""}
  const headers = token ? { 'Authorization': \`Bearer \${token}\`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  const response = await fetch(\`${host}${dynamicPath}\` + ${
    queryParams.length ? "query" : '""'
  }, {
    method: "${method}",
    ${
      method.toLowerCase() !== "get"
        ? `body: ${fetchBody}, headers: headers`
        : `headers: headers`
    }
  });
  return response.json();
};`;

  return apiFunction;
};

export {
  generateInterface,
  generateAxiosAPICode,
  generateFetchAPICode,
  objectToQueryString,
};
