import {
  jsonToTs,
  jsonToZod,
  openApiToLiteralJson,
  toTsType,
} from "./typeGenerator";

describe("toTsType", () => {
  it('타입이 숫자인 경우 "number"를 반환한다', () => {
    expect(toTsType(1)).toEqual("number");
  });

  it('타입이 불린인 경우 "boolean"를 반환한다', () => {
    expect(toTsType(true)).toEqual("boolean");
  });

  it('값이 null인 경우 "null"을 반환한다', () => {
    // null에 대한 typeof 연산은 "object"를 반환한다
    // 이를 unknown으로 처리
    expect(toTsType(null)).toEqual("unknown");
  });

  it("타입이 배열인 경우 배열 내의 첫 번째 요소 타입에 대한 배열 타입을 반환한다", () => {
    expect(toTsType([1, 2, 3])).toEqual("number[]");
    expect(toTsType(["a", "b", "c"])).toEqual("string[]");
    expect(toTsType([true, false])).toEqual("boolean[]");
  });

  it('타입이 객체인 경우 "unknown"를 반환한다', () => {
    expect(toTsType({ a: 1, b: 2 })).toEqual("unknown");
  });

  it('나머지 경우에는 "string"을 반환한다', () => {
    expect(toTsType("test")).toEqual("string");
  });
});

describe("jsonToTs", () => {
  it("제공된 JSON에 대해 적절한 TypeScript 인터페이스 문자열을 생성한다", () => {
    const json = {
      hasNext: false,
      contents: [
        {
          bookmarkId: 1,
          title: "리액트 쌈싸먹기",
          url: "https://google.com",
          isUserLike: true,
        },
      ],
    };

    const expected =
      "export interface Json {\n" +
      "  hasNext: boolean;\n" +
      "  contents: Contents[];\n" +
      "}\n" +
      "export interface Contents {\n" +
      "  bookmarkId: number;\n" +
      "  title: string;\n" +
      "  url: string;\n" +
      "  isUserLike: boolean;\n" +
      "}";

    expect(jsonToTs("json", json).interfaceArray.join("\n")).toEqual(expected);
  });
  it("배열 형태의 JSON에 대해 적절한 TypeScript 인터페이스 문자열을 생성한다", () => {
    const json = [
      {
        bookmarkId: 1,
        title: "리액트 쌈싸먹기",
        url: "https://google.com",
        isUserLike: true,
      },
    ];

    const expected =
      "export interface JsonItem {\n" +
      "  bookmarkId: number;\n" +
      "  title: string;\n" +
      "  url: string;\n" +
      "  isUserLike: boolean;\n" +
      "}";

    expect(jsonToTs("json", json).interfaceArray.join("\n")).toEqual(expected);
  });

  it("단일 값에 대한 적절한 type을 생성한다", () => {
    const value = 5;

    const expected = "export type Json = number;";

    expect(jsonToTs("json", value).interfaceArray.join("\n")).toEqual(expected);
  });
});

describe("jsonToZod", () => {
  it("기본 타입들에 대해 적절한 Zod 스키마를 생성한다", () => {
    const json = {
      stringField: "hello",
      numberField: 42,
      integerField: 100.5,
      booleanField: true,
      nullField: null,
    };

    const expected =
      "const RootSchema = z.object({\n" +
      "  stringField: z.string(),\n" +
      "  numberField: z.number().int(),\n" +
      "  integerField: z.number(),\n" +
      "  booleanField: z.boolean(),\n" +
      "  nullField: z.null()\n" +
      "});";

    expect(jsonToZod(json)).toEqual(expected);
  });

  it("배열 타입에 대해 적절한 Zod 스키마를 생성한다", () => {
    const json = {
      stringArray: ["a", "b", "c"],
      numberArray: [1, 2, 3],
      objectArray: [
        { id: 1, name: "item1" },
        { id: 2, name: "item2" },
      ],
      emptyArray: [],
    };

    const expected =
      "const objectArrayItemSchema = z.object({\n" +
      "  id: z.number().int(),\n" +
      "  name: z.string()\n" +
      "});\n\n" +
      "const RootSchema = z.object({\n" +
      "  stringArray: z.array(z.string()),\n" +
      "  numberArray: z.array(z.number().int()),\n" +
      "  objectArray: z.array(objectArrayItemSchema),\n" +
      "  emptyArray: z.array(z.unknown())\n" +
      "});";

    expect(jsonToZod(json)).toEqual(expected);
  });

  it("중첩된 객체에 대해 적절한 Zod 스키마를 생성한다", () => {
    const json = {
      user: {
        id: 1,
        profile: {
          name: "John",
          age: 30,
          active: true,
        },
      },
    };

    const expected =
      "const profileSchema = z.object({\n" +
      "  name: z.string(),\n" +
      "  age: z.number().int(),\n" +
      "  active: z.boolean()\n" +
      "});\n\n" +
      "const userSchema = z.object({\n" +
      "  id: z.number().int(),\n" +
      "  profile: profileSchema\n" +
      "});\n\n" +
      "const RootSchema = z.object({\n" +
      "  user: userSchema\n" +
      "});";

    expect(jsonToZod(json)).toEqual(expected);
  });

  it("배열 형태의 JSON에 대해 적절한 Zod 스키마를 생성한다", () => {
    const json = [
      { id: 1, name: "item1" },
      { id: 2, name: "item2" },
    ];

    const expected =
      "const RootItemSchema = z.object({\n" +
      "  id: z.number().int(),\n" +
      "  name: z.string()\n" +
      "});\n\n" +
      "const RootSchema = z.array(RootItemSchema);";

    expect(jsonToZod(json)).toEqual(expected);
  });

  it("빈 배열에 대해 적절한 Zod 스키마를 생성한다", () => {
    const json: unknown[] = [];

    const expected = "const RootSchema = z.array(z.unknown());";

    expect(jsonToZod(json)).toEqual(expected);
  });

  it("null과 undefined 값에 대해 적절한 Zod 스키마를 생성한다", () => {
    const json = {
      nullValue: null,
      undefinedValue: undefined,
    };

    const expected =
      "const RootSchema = z.object({\n" +
      "  nullValue: z.null(),\n" +
      "  undefinedValue: z.undefined()\n" +
      "});";

    expect(jsonToZod(json)).toEqual(expected);
  });

  it("복잡한 중첩 구조에 대해 적절한 Zod 스키마를 생성한다", () => {
    const json = {
      users: [
        {
          id: 1,
          name: "John",
          posts: [
            {
              id: 101,
              title: "First Post",
              tags: ["tech", "react"],
              published: true,
            },
          ],
        },
      ],
      metadata: {
        total: 1,
        page: 1,
      },
    };

    const expected =
      "const postsItemSchema = z.object({\n" +
      "  id: z.number().int(),\n" +
      "  title: z.string(),\n" +
      "  tags: z.array(z.string()),\n" +
      "  published: z.boolean()\n" +
      "});\n\n" +
      "const usersItemSchema = z.object({\n" +
      "  id: z.number().int(),\n" +
      "  name: z.string(),\n" +
      "  posts: z.array(postsItemSchema)\n" +
      "});\n\n" +
      "const metadataSchema = z.object({\n" +
      "  total: z.number().int(),\n" +
      "  page: z.number().int()\n" +
      "});\n\n" +
      "const RootSchema = z.object({\n" +
      "  users: z.array(usersItemSchema),\n" +
      "  metadata: metadataSchema\n" +
      "});";

    expect(jsonToZod(json)).toEqual(expected);
  });

  it("커스텀 루트 이름을 사용하여 스키마를 생성한다", () => {
    const json = { name: "test", value: 42 };

    const expected =
      "const CustomSchema = z.object({\n" +
      "  name: z.string(),\n" +
      "  value: z.number().int()\n" +
      "});";

    expect(jsonToZod(json, "Custom")).toEqual(expected);
  });

  it("알 수 없는 타입에 대해 z.unknown()을 사용한다", () => {
    const json = {
      functionField: function () {
        return "test";
      },
      symbolField: Symbol("test"),
    };

    const expected =
      "const RootSchema = z.object({\n" +
      "  functionField: z.unknown(),\n" +
      "  symbolField: z.unknown()\n" +
      "});";

    expect(jsonToZod(json)).toEqual(expected);
  });

  it("optional 필드에 대해 nullish를 적용한다", () => {
    const json = {
      id: 0,
      title: "string",
      "content?": "string",
      "updatedAt?": "date_time_string",
    };

    const expected =
      "const RootSchema = z.object({\n" +
      "  id: z.number().int(),\n" +
      "  title: z.string(),\n" +
      "  content: z.string().nullish(),\n" +
      "  updatedAt: z.string().nullish()\n" +
      "});";

    expect(jsonToZod(json)).toEqual(expected);
  });
});

describe("openApiToLiteralJson", () => {
  it("기본 타입들에 대해 매핑되는 리터럴 값을 생성한다", () => {
    const schema = {
      schema: "inline",
      typeName: "TestSchema",
      properties: {
        id: {
          type: "integer",
          format: "int32",
          description: "게시글 ID",
        },
        title: {
          type: "string",
          description: "게시글 제목",
        },
        isActive: {
          type: "boolean",
          description: "활성화 여부",
        },
        content: {
          type: "string",
        },
      },
      required: ["id", "title", "isActive"],
      type: "object",
    };

    const expected = {
      id: 0,
      title: "string",
      isActive: true,
      "content?": "string",
    };

    expect(openApiToLiteralJson(schema)).toEqual(expected);
  });

  it("필수 필드와 선택 필드를 올바르게 구분한다", () => {
    const schema = {
      schema: "inline",
      typeName: "RequiredOptionalSchema",
      properties: {
        requiredField: {
          type: "string",
        },
        optionalField: {
          type: "number",
        },
      },
      required: ["requiredField"],
      type: "object",
    };

    const expected = {
      requiredField: "string",
      "optionalField?": 0,
    };

    expect(openApiToLiteralJson(schema)).toEqual(expected);
  });

  it("중첩된 객체 구조를 올바르게 처리한다", () => {
    const schema = {
      schema: "inline",
      typeName: "NestedObjectSchema",
      properties: {
        user: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int32",
            },
            profile: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                age: {
                  type: "integer",
                },
              },
              required: ["name", "age"],
            },
          },
          required: ["id", "profile"],
        },
      },
      required: ["user"],
      type: "object",
    };

    const expected = {
      user: {
        id: 0,
        profile: {
          name: "string",
          age: 0,
        },
      },
    };

    expect(openApiToLiteralJson(schema)).toEqual(expected);
  });

  it("배열 타입을 올바르게 처리한다", () => {
    const schema = {
      schema: "inline",
      typeName: "ArraySchema",
      properties: {
        tags: {
          type: "array",
          items: {
            type: "string",
          },
        },
        scores: {
          type: "array",
          items: {
            type: "integer",
            format: "int32",
          },
        },
        users: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "integer",
              },
              name: {
                type: "string",
              },
            },
            required: ["id", "name"],
          },
        },
      },
      required: ["tags", "scores", "users"],
      type: "object",
    };

    const expected = {
      tags: ["string"],
      scores: [0],
      users: [
        {
          id: 0,
          name: "string",
        },
      ],
    };

    expect(openApiToLiteralJson(schema)).toEqual(expected);
  });

  it("특수 포맷의 문자열을 올바르게 처리한다", () => {
    const schema = {
      schema: "inline",
      typeName: "FormatStringSchema",
      properties: {
        createdAt: {
          type: "string",
          format: "date-time",
        },
        birthDate: {
          type: "string",
          format: "date",
        },
        password: {
          type: "string",
          format: "password",
        },
        fileData: {
          type: "string",
          format: "binary",
        },
      },
      required: ["createdAt", "birthDate", "password", "fileData"],
      type: "object",
    };

    const expected = {
      createdAt: "date_time_string",
      birthDate: "date_string",
      password: "password_string",
      fileData: "base64_string",
    };

    expect(openApiToLiteralJson(schema)).toEqual(expected);
  });

  it("null 스키마에 대해 null을 반환한다", () => {
    expect(openApiToLiteralJson(null)).toBeNull();
  });

  it("빈 properties에 대해 빈 객체를 반환한다", () => {
    const schema = {
      schema: "inline",
      typeName: "EmptySchema",
      properties: {},
      required: [],
      type: "object",
    };

    const expected = {};

    expect(openApiToLiteralJson(schema)).toEqual(expected);
  });

  it("복잡한 중첩 구조를 올바르게 처리한다", () => {
    const schema = {
      schema: "inline",
      typeName: "ComplexNestedSchema",
      properties: {
        posts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "integer",
              },
              title: {
                type: "string",
              },
              author: {
                type: "object",
                properties: {
                  id: {
                    type: "integer",
                  },
                  name: {
                    type: "string",
                  },
                  profile: {
                    type: "object",
                    properties: {
                      avatar: {
                        type: "string",
                        format: "binary",
                      },
                      bio: {
                        type: "string",
                      },
                    },
                    required: ["avatar"],
                  },
                },
                required: ["id", "name", "profile"],
              },
              tags: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: ["id", "title", "author", "tags"],
          },
        },
        metadata: {
          type: "object",
          properties: {
            total: {
              type: "integer",
            },
            page: {
              type: "integer",
            },
          },
          required: ["total", "page"],
        },
      },
      required: ["posts", "metadata"],
      type: "object",
    };

    const expected = {
      posts: [
        {
          id: 0,
          title: "string",
          author: {
            id: 0,
            name: "string",
            profile: {
              avatar: "base64_string",
              "bio?": "string",
            },
          },
          tags: ["string"],
        },
      ],
      metadata: {
        total: 0,
        page: 0,
      },
    };

    expect(openApiToLiteralJson(schema)).toEqual(expected);
  });
});
