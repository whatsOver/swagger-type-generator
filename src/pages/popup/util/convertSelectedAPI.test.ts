import { API } from "@src/pages/content/modules/getAPIList";
import { SwaggerDocs } from "../api/docs";
import { convertSelectedAPI } from "./convertSelectedAPI";

describe("convertSelectedAPI", () => {
  let data: SwaggerDocs;
  beforeAll(() => {
    data = {
      components: {
        schemas: {},
      },
      info: {
        title: "",
        version: "",
      },
      paths: {
        "/api": {
          get: {
            operationId: "search_handlers_get_real_time_searches",
            summary: "실시간 검색어 목록 조회",
            parameters: [],
            responses: {
              "200": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/RealTimeSearchesView",
                    },
                  },
                },
              },
            },
            tags: ["검색"],
          },
        },
        "/api/media": {
          post: {
            operationId: "media_handlers_upload_media",
            summary: "미디어 업로드",
            parameters: [],
            responses: {
              "201": {
                description: "Created",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/MediaListView",
                    },
                  },
                },
              },
              "401": {
                description: "Unauthorized",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorView",
                    },
                  },
                },
              },
            },
            description: "미디어를 업로드합니다.",
            tags: ["미디어"],
            requestBody: {
              content: {
                "multipart/form-data": {
                  schema: {
                    title: "FileParams",
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
                    },
                    required: ["files"],
                  },
                },
              },
              required: true,
            },
            security: [
              {
                FirebaseAuth: [],
              },
            ],
          },
        },
      },
    };
  });
  it("requestBody가 없는 경우", () => {
    // GIVEN & WHEN
    const api: API = {
      method: "get",
      path: "/api",
      description: "",
    };
    const result = convertSelectedAPI(data, api);

    // THEN
    expect(result).toEqual({
      method: "get",
      path: "/api",
      description: "",
      params: [],
      body: null,
      contentType: "application/json",
    });
  });

  it("requestBody가 있는 경우 > Form 데이터", () => {
    // GIVEN & WHEN
    const api: API = {
      method: "post",
      path: "/api/media",
      description: "",
    };
    const result = convertSelectedAPI(data, api);

    // THEN
    expect(result).toEqual({
      method: "post",
      path: "/api/media",
      description: "",
      params: [],
      body: {
        title: "FileParams",
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
        },
        required: ["files"],
      },
      contentType: "multipart/form-data",
    });
  });
});
