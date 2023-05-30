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

const generateAPICode = ({ api, formValues }: GenerateAPICodeProps): string => {
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

export { generateInterface, generateAPICode };
