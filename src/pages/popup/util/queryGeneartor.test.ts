import {
  GenerateReactQueryHookProps,
  generateReactQueryHook,
} from "./queryGenerator";

describe("generateReactQueryHook", () => {
  it("GET 방식에 대한 useQuery 훅을 생성", () => {
    const api: Pick<GenerateReactQueryHookProps, "api">["api"] = {
      method: "GET",
      params: [
        {
          name: "param1",
          in: "path",
          description: "",
          required: true,
          schema: { type: "string" },
        },
      ],
    };
    const apiFunctionName = "getData";

    const result = generateReactQueryHook({ api, apiFunctionName });

    expect(result).toBe(`
export interface GetDataRequest {
  param1: string;
  token?: string;
}

const GetDataKey = (params: GetDataRequest) => ['GET', params.param1];

export const useGetDataQuery = (params: GetDataRequest) => {
  return useQuery(GetDataKey(params), async () => getData(params));
};
`);
  });

  it("POST 방식에 대한 useMutation 훅을 생성", () => {
    const api: Pick<GenerateReactQueryHookProps, "api">["api"] = {
      method: "POST",
      params: [],
    };
    const apiFunctionName = "postData";

    const result = generateReactQueryHook({ api, apiFunctionName });

    expect(result).toBe(`
export const usePostDataMutation = () => {
  return useMutation(postData);
};
`);
  });
});
