import { Parameters, Schemas } from "@/entities/swagger/types";
import {
  generateFormData,
  getBody,
  getParams,
  getQueryParams,
  getRequestBodyKey,
  replacePathParams,
} from "./request";

describe("getQueryParams", () => {
  it("주어진 쿼리 파라미터를 정상적으로 추출한다", () => {
    // GIVEN
    const PARAM1 = "blockerId";
    const PARAM2 = "bookmarkId";
    const params: Parameters[] = [
      {
        name: PARAM1,
        in: "path",
        description: "차단 요청을 보낸 유저 ID 값",
        required: true,
        schema: {
          type: "integer",
          format: "int64",
        },
        example: 1,
      },
      {
        name: PARAM2,
        in: "path",
        description: "차단 해제를 할 북마크 ID 값",
        required: true,
        schema: {
          type: "integer",
          format: "int64",
        },
        example: 2,
      },
    ];
    const formValues = {
      [PARAM1]: "1",
      [PARAM2]: "2",
    };

    // WHEN
    const result = getQueryParams(params, formValues);

    // THEN
    expect(result).toEqual({ [PARAM1]: "1", [PARAM2]: "2" });
  });
});

describe("getParams", () => {
  it("주어진 PathParam을 정상적으로 추출한다", () => {
    // GIVEN
    const PARAM1 = "blockerId";
    const PARAM2 = "bookmarkId";
    const params: Parameters[] = [
      {
        name: PARAM1,
        in: "path",
        description: "차단 요청을 보낸 유저 ID 값",
        required: true,
        schema: {
          type: "integer",
          format: "int64",
        },
        example: 1,
      },
      {
        name: PARAM2,
        in: "query",
        description: "차단 해제를 할 북마크 ID 값",
        required: true,
        schema: {
          type: "integer",
          format: "int64",
        },
        example: 2,
      },
    ];

    const withoutPathParam: Parameters[] = params.filter(
      (param) => param.in !== "path"
    );
    // WHEN
    const result = getParams(withoutPathParam);

    // THEN
    expect(result).toEqual(`${PARAM2}`);
  });
});

describe("replacePathParams", () => {
  it("PathParam에 대해서 일치하는 Param을 치환한다", () => {
    // GIVEN
    const path = "/:param1/:param2";
    const formValues = { param1: "value1", param2: "value2" };

    // WHEN
    const result = replacePathParams(path, formValues);

    // THEN
    expect(result).toEqual("/value1/value2");
  });
});

describe("getBody", () => {
  it("입력 값에 대해서 > Body에 필요한 값에 대해서 추출한다", () => {
    // GIVEN
    const body: Schemas = {
      required: ["emoji", "name"],
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        emoji: {
          type: "string",
        },
      },
    };
    const formValues = { name: "장동현", emoji: "😃" };

    // WHEN
    const result = getBody(body, formValues);

    // THEN
    expect(result).toEqual({ name: "장동현", emoji: "😃" });
  });
});

describe("getRequestBodyKey", () => {
  it("입력 값에 대해서 > Body에 필요한 값에 대해서 추출한다", () => {
    // GIVEN
    const body: Schemas = {
      required: ["emoji", "name"],
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        emoji: {
          type: "string",
        },
      },
    };

    // WHEN
    const result = getRequestBodyKey(body);

    // THEN
    expect(result).toEqual("name, emoji");
  });
});

describe("generateFormData", () => {
  it("creates FormData with correct data", () => {
    // GIVEN
    const body: Schemas = {
      required: ["emoji", "name"],
      type: "object",
      properties: {
        files: {
          title: "Files",
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
        name: {
          type: "string",
        },
      },
    };

    const formValues = { files: ["file1", "file2"] };

    // WHEN
    const formData = generateFormData(body, formValues);

    // THEN
    const formDataEntries = Array.from(formData.entries());
    expect(formDataEntries).toEqual([
      ["files", "file1"],
      ["files", "file2"],
    ]);
  });
});
