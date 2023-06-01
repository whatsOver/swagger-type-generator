import { Parameters, Schemas } from "../api/docs";
import { getBody, getQueryParams } from "./request";

const generateInterface = (params: Parameters[]): string => {
  const interfaceItems = params
    .filter((param) => param.in !== "body")
    .map((param) => `  ${param.name}: ${param.schema.type};`)
    .join("\n");

  const interfaceName = "RequestInterface";

  return `interface ${interfaceName} {\n${interfaceItems}\n}`;
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
}

const generateAxiosAPICode = ({
  api,
  formValues,
}: GenerateAPICodeProps): string => {
  const interfaceName = "RequestInterface";
  const { method, host, path, params, body } = api;

  const args = params
    .filter((param) => param.in !== "body")
    .map((param) => param.name)
    .join(", ");

  const axiosParams = getQueryParams(params, formValues);

  const axiosData = JSON.stringify(body ? getBody(body, formValues) : {});

  const apiFunction = `
const ${method.toLowerCase()}API = async ({ ${args} }: ${interfaceName}) => {
  const { data } = await axios({
    method: "${method}",
    url: "${host}${path}",
    params: ${JSON.stringify(axiosParams)},
    data: ${axiosData},
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

  const queryParams = params.filter((param) => param.in === "query");
  const pathParams = params.filter((param) => param.in === "path");

  // Generate the string for path parameters dynamically
  const dynamicPath = pathParams.reduce(
    (accPath, param) => accPath.replace(`{${param.name}}`, `\${${param.name}}`),
    path
  );

  const fetchParams = queryParams.length
    ? `\`?${objectToQueryString(getQueryParams(queryParams, formValues))}\``
    : "";

  const fetchBody = JSON.stringify(body ? getBody(body, formValues) : {});

  const apiFunction = `
const ${method.toLowerCase()}API = async ({ ${args} }: ${interfaceName}) => {
  const query = ${fetchParams};
  const response = await fetch(\`${host}${dynamicPath}\` + query, {
    method: "${method}",
    ${
      method.toLowerCase() !== "get"
        ? `body: ${fetchBody}, headers: { 'Content-Type': 'application/json' }`
        : ""
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
