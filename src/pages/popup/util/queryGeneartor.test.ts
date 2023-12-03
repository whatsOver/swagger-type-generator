import {
  GenerateReactQueryHookProps,
  generateQueryInterface,
  generateQueryKey,
  generateReactQueryHook,
} from "./queryGenerator";

describe("generateQueryKey", () => {
  it("params가 없는 경우", () => {
    // given
    const params = [];

    // when
    const result = generateQueryKey(params);

    // then
    expect(result).toBe("");
  });

  it("params가 있는 경우", () => {
    // given
    const params = [
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
        required: true,
        schema: { type: "number" },
      },
      {
        name: "param3",
        in: "query",
        description: "",
        required: true,
        schema: { type: "boolean" },
      },
    ];

    // when
    const result = generateQueryKey(params);

    // then
    expect(result).toBe("param1,param2,param3");
  });
});

describe("interface를 생성하는 generateQueryInterface", () => {
  it("params가 없는 경우", () => {
    // given
    const apiFunctionName = "getData";
    const params = [];

    // when
    const result = generateQueryInterface(apiFunctionName, params);

    // then
    expect(result).toEqual({
      interfaceStr: `
export interface GetDataRequest {
  token?: string;
}`,
      paramsInterface: "GetDataRequest",
    });
  });

  it("params가 있는 경우", () => {
    // given
    const apiFunctionName = "getData";
    const params = [
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
        required: true,
        schema: { type: "number" },
      },
      {
        name: "param3",
        in: "query",
        description: "",
        required: true,
        schema: { type: "boolean" },
      },
    ];

    // when
    const result = generateQueryInterface(apiFunctionName, params);

    // then
    expect(result).toEqual({
      paramsInterface: "GetDataRequest",
      interfaceStr: `
export interface GetDataRequest {
  param1: string;
  param2: number;
  param3: boolean;
  token?: string;
}`,
    });
  });
});

describe("generateReactQueryHook", () => {
  it("GET 방식에 대한 useQuery 훅을 생성 (params가 있는 경우)", () => {
    // given
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

    // when
    const result = generateReactQueryHook({ api, apiFunctionName });

    // then
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

  it("GET 방식에 대한 useQuery 훅을 생성 (params가 없는 경우)", () => {
    // given
    const api: Pick<GenerateReactQueryHookProps, "api">["api"] = {
      method: "GET",
      params: [],
    };
    const apiFunctionName = "getData";

    // when
    const result = generateReactQueryHook({ api, apiFunctionName });

    // then
    expect(result).toBe(`
export interface GetDataRequest {
  token?: string;
}

const GetDataKey = (params: GetDataRequest) => ['GET'];

export const useGetDataQuery = (params: GetDataRequest) => {
  return useQuery(GetDataKey(params), async () => getData(params));
};
`);
  });
  it("POST 방식에 대한 useMutation 훅을 생성 (params가 있는 경우)", () => {
    const api: Pick<GenerateReactQueryHookProps, "api">["api"] = {
      method: "POST",
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
    const apiFunctionName = "postData";

    const result = generateReactQueryHook({ api, apiFunctionName });

    expect(result).toBe(`
export interface PostDataRequest {
  param1: string;
  token?: string;
}

export const usePostDataMutation = (params: PostDataRequest) => {
  return useMutation(postData);
};
`);
  });

  it("POST 방식에 대한 useMutation 훅을 생성 (params가 없는 경우)", () => {
    const api: Pick<GenerateReactQueryHookProps, "api">["api"] = {
      method: "POST",
      params: [],
    };
    const apiFunctionName = "postData";

    const result = generateReactQueryHook({ api, apiFunctionName });

    expect(result).toBe(`
export interface PostDataRequest {
  token?: string;
}

export const usePostDataMutation = (params: PostDataRequest) => {
  return useMutation(postData);
};
`);
  });
});
