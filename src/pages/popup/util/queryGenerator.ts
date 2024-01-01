import { Method } from "axios";
import { Parameters } from "../api/docs";
import { typeConverter } from "./typeConverter";

const generateQueryKey = (params: Parameters[]) => {
  return params
    .filter((param) => param.in !== "body")
    .map((param) => param.name)
    .join(",");
};

const generateQueryInterface = (
  apiFunctionName: string,
  params: Parameters[]
) => {
  const capitalizedFunctionName =
    apiFunctionName.charAt(0).toUpperCase() + apiFunctionName.slice(1);

  const paramsInterface = `${capitalizedFunctionName}Request`;

  const interfaceItems = params
    ? params
        .filter((param) => param.in !== "body")
        .map((param) => `  ${param.name}: ${typeConverter(param.schema.type)};`)
        .join("\n")
    : "";

  // token이 필요한 경우에만 token interface를 추가
  const tokenLine = interfaceItems.length
    ? `\n  token?: string;`
    : `  token?: string;`;

  let interfaceStr = "";
  if (paramsInterface) {
    interfaceStr = `
export interface ${paramsInterface} {\n${interfaceItems}${tokenLine}
}`;
  }

  return { paramsInterface, interfaceStr };
};

export interface GenerateReactQueryHookProps {
  api: {
    method: Method;
    params: Parameters[];
  };
  apiFunctionName: string;
}

const generateReactQueryHook = ({
  api,
  apiFunctionName,
}: GenerateReactQueryHookProps): string => {
  const { method, params } = api;

  const capitalizedFunctionName =
    apiFunctionName.charAt(0).toUpperCase() + apiFunctionName.slice(1);

  const { paramsInterface, interfaceStr } = generateQueryInterface(
    capitalizedFunctionName,
    params
  );

  // queryKey 함수를 생성
  const queryKey = params ? generateQueryKey(params) : "";
  const queryKeysWithParams = queryKey.length
    ? queryKey
        .split(",")
        .map((key) => `params.${key}`)
        .join(", ")
    : "";
  const queryKeyFunctionString = `const ${capitalizedFunctionName}Key = (params: ${paramsInterface}) => ['${method}'${
    queryKeysWithParams.length ? ", " + queryKeysWithParams : ""
  }];`;

  const queryKeyString = `${capitalizedFunctionName}Key(params)`;

  if (method.toLowerCase() === "get") {
    return `${interfaceStr}\n
${queryKeyFunctionString}\n
export const use${capitalizedFunctionName}Query = (params: ${paramsInterface}) => {
  return useQuery(${queryKeyString}, async () => ${apiFunctionName}(params));
};
`;
  } else {
    return `${interfaceStr}\n
export const use${capitalizedFunctionName}Mutation = (params: ${paramsInterface}) => {
  return useMutation(${apiFunctionName});
};
`;
  }
};

export { generateQueryKey, generateQueryInterface, generateReactQueryHook };
