import { Parameters } from "../api/docs";
import {
  generateAxiosAPICode,
  generateFetchAPICode,
  generateInterface,
  objectToQueryString,
} from "./apiGenerator";
import { getBody, getParams } from "./request";

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

  const sampleFormValues = {
    param1: "value1",
    param2: "value2",
  };

  it("주어진 Param에 대해서 올바른 interface 타입을 생성한다", () => {
    const expectedInterface = `interface RequestInterface {\n  param1: string;\n  param2: number;\n}`;
    const result = generateInterface(sampleParams);

    expect(result).toBe(expectedInterface);
  });

  it("올바른 API 코드를 생성한다 axios 기반", () => {
    const result = generateAxiosAPICode({
      api: sampleAPI,
      formValues: sampleFormValues,
    });

    // 결과값의 패턴이 맞는지 확인
    expect(result).toContain(
      `const ${sampleAPI.method.toLowerCase()}API = async ({ ${sampleParams
        .map((param) => param.name)
        .join(", ")} }: RequestInterface) => {`
    );
    expect(result).toContain(`method: "${sampleAPI.method}",`);
    expect(result).toContain(`url: "${sampleAPI.host}${sampleAPI.path}",`);
    expect(result).toContain(`params: { ${getParams(sampleParams)} },`);
    expect(result).toContain(
      `data: ${JSON.stringify(
        sampleAPI.body ? getBody(sampleAPI.body, sampleFormValues) : {}
      )},`
    );
  });

  it("objectToQueryString 함수가 올바르게 동작한다", () => {
    const result = objectToQueryString(sampleFormValues);

    expect(result).toBe("param1={param1}&param2={param2}");
  });

  it("올바른 API 코드를 생성한다 fetch 기반", () => {
    const result = generateFetchAPICode({
      api: sampleAPI,
      formValues: sampleFormValues,
    });

    // 결과값의 패턴이 맞는지 확인
    expect(result).toContain(
      `const ${sampleAPI.method.toLowerCase()}API = async ({ ${sampleParams
        .map((param) => param.name)
        .join(", ")} }: RequestInterface) => {`
    );
    expect(result).toContain(`method: "${sampleAPI.method}",`);
    expect(result).toContain(
      sampleAPI.method !== "get"
        ? `body: ${JSON.stringify(
            sampleAPI.body ? getBody(sampleAPI.body, sampleFormValues) : {}
          )},`
        : ""
    );
  });
});
