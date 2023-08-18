import { Parameters } from "../api/docs";
import {
  generateAxiosAPICode,
  generateFetchAPICode,
  generateInterface,
  objectToQueryString,
} from "./apiGenerator";
import { getBody, getParams, getQueryParamsArray } from "./request";

describe("API 코드 생성", () => {
  const sampleParams: Parameters[] = [
    {
      name: "param1",
      in: "path",
      description: "",
      required: true,
      schema: { type: "string" },
    },
    {
      name: "param2",
      in: "query",
      description: "",
      required: false,
      schema: { type: "number" },
    },
  ];

  const sampleAPI = {
    method: "get",
    host: "https://api.example.com",
    path: "/path/{param1}",
    params: sampleParams,
    body: null,
  };

  const sampleAPIWithBody = {
    ...sampleAPI,
    method: "post",
    body: {
      type: "object",
      properties: {
        property1: { type: "string", example: "value1" },
        property2: { type: "number", example: 2 },
      },
    },
  };

  const sampleFormValues = {
    param1: "value1",
    param2: "value2",
  };

  it("주어진 Param에 대해서 올바른 interface 타입을 생성한다", () => {
    const expectedInterface = `interface RequestInterface {\n  param1: string;\n  param2: number;\n  token?: string;\n}`;
    const result = generateInterface(sampleParams);

    expect(result).toBe(expectedInterface);
  });

  it("올바른 API 코드를 생성한다 axios 기반", () => {
    const result = generateAxiosAPICode({
      api: sampleAPI,
    });

    // 결과값의 패턴이 맞는지 확인
    expect(result).toContain(
      `const ${sampleAPI.method.toLowerCase()}API = async ({ ${sampleParams
        .map((param) => param.name)
        .join(", ")}, token }: RequestInterface) => {`
    );
    expect(result).toContain(`method: "${sampleAPI.method}",`);
    expect(result).toContain(
      `url: "${sampleAPI.host}${sampleAPI.path.replace("{", "${")}",`
    );
    expect(result).toContain(
      `params: { ${getQueryParamsArray(sampleParams)} },`
    );
    expect(result).toContain(
      `data: ${JSON.stringify(
        sampleAPI.body ? getBody(sampleAPI.body, sampleFormValues) : {}
      )},`
    );
  });

  it("axios 기반으로 올바른 API 코드를 생성한다 (body가 있는 경우)", () => {
    const result = generateAxiosAPICode({
      api: sampleAPIWithBody,
      rootInterfaceKey: "Json",
    });

    const args = sampleAPIWithBody.params
      ? getParams(sampleAPIWithBody.params)
      : "";
    const bodyArgs = sampleAPIWithBody.body
      ? `${args.length > 0 ? `${args}, ` : ""}${sampleAPIWithBody.method}Data`
      : args;

    const parameters = bodyArgs.length > 0 ? `${bodyArgs}, token` : "token";

    // 결과값의 패턴이 맞는지 확인
    expect(result).toContain(
      `const ${sampleAPIWithBody.method.toLowerCase()}API = async ({ ${parameters} }: RequestInterface) => {`
    );
    expect(result).toContain(`method: "${sampleAPIWithBody.method}",`);
    expect(result).toContain(`data: ${sampleAPIWithBody.method}Data,`);
  });

  it("objectToQueryString 함수가 올바르게 동작한다", () => {
    const sampleParams = "param1, param2";
    const result = objectToQueryString(sampleParams);

    expect(result).toBe("param1=${param1}&param2=${param2}");
  });

  it("올바른 API 코드를 생성한다 fetch 기반", () => {
    const result = generateFetchAPICode({
      api: sampleAPI,
      rootInterfaceKey: "Json",
    });

    const queryParams = sampleParams.filter(
      (param) => param.in === "query" || param.in === "path"
    );
    const args = queryParams.map((param) => param.name);
    const bodyArgs = sampleAPI.body
      ? args.concat(`${sampleAPI.method}Data`)
      : args;
    const parameters =
      bodyArgs.length > 0 ? `${bodyArgs.join(",")}, token` : "token";

    // 결과값의 패턴이 맞는지 확인
    expect(result).toContain(
      `const ${sampleAPI.method.toLowerCase()}API = async ({ ${parameters} }: RequestInterface): Promise<Json> => {`
    );
    expect(result).toContain(`method: "${sampleAPI.method}",`);
    expect(result).toContain(
      sampleAPI.method.toLowerCase() !== "get" && sampleAPI.body
        ? `body: JSON.stringify(${sampleAPI.method}Data),`
        : ""
    );
  });

  it("fetch 기반으로 올바른 API 코드를 생성한다 (body가 있는 경우)", () => {
    const result = generateFetchAPICode({
      api: sampleAPIWithBody,
      rootInterfaceKey: "Json",
    });

    const queryParams = sampleParams.filter(
      (param) => param.in === "query" || param.in === "path"
    );
    const args = queryParams.map((param) => param.name);
    const bodyArgs = sampleAPIWithBody.body
      ? args.concat(`${sampleAPIWithBody.method}Data`)
      : args;
    const parameters =
      bodyArgs.length > 0 ? `${bodyArgs.join(",")}, token` : "token";

    // 결과값의 패턴이 맞는지 확인
    expect(result).toContain(
      `const ${sampleAPIWithBody.method.toLowerCase()}API = async ({ ${parameters} }: RequestInterface): Promise<Json> => {`
    );
    expect(result).toContain(`method: "${sampleAPIWithBody.method}",`);
    expect(result).toContain(
      `body: JSON.stringify(${sampleAPIWithBody.method}Data),`
    );
  });
});
