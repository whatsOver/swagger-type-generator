import { Parameters } from "../api/docs";
import { generateAPICode, generateInterface } from "./apiGenerator";
import { getBody, getQueryParams } from "./request";

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
    const result = generateAPICode({
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
    expect(result).toContain(
      `params: ${JSON.stringify(
        getQueryParams(sampleAPI.params, sampleFormValues)
      )},`
    );
    expect(result).toContain(
      `data: ${JSON.stringify(
        sampleAPI.body ? getBody(sampleAPI.body, sampleFormValues) : {}
      )},`
    );
  });
});