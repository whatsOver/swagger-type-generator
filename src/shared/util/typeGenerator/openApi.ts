import { SchemaInfo, SchemasProperties } from "@/entities/swagger/types";

export const openApiToTs = (
  schema: SchemaInfo,
  rootName = "Interface"
): string => {
  const interfaces: string[] = [];
  const interfaceMap = new Map<string, string>();

  const generateTsType = (prop: SchemasProperties, name: string): string => {
    if (prop.enum) {
      const enumValues = prop.enum.map((v) => `"${v}"`).join(" | ");
      return enumValues;
    }

    switch (prop.type) {
      case "string":
        if (prop.format === "date-time") return "string";
        if (prop.format === "date") return "string";
        if (prop.format === "password") return "string";
        if (prop.format === "byte" || prop.format === "binary") return "File";
        return "string";

      case "integer":
      case "number":
        return "number";

      case "boolean":
        return "boolean";

      case "array":
        if (prop.items) {
          const itemType = generateTsType(prop.items, `${name}Item`);
          return `${itemType}[]`;
        }
        return "unknown[]";

      case "object":
        if (prop.properties) {
          const interfaceName = `${
            name.charAt(0).toUpperCase() + name.slice(1)
          }`;
          const interfaceKey = `${interfaceName}Interface`;

          if (interfaceMap.has(interfaceKey)) {
            return interfaceName;
          }

          let interfaceContent = `export interface ${interfaceName} {\n`;

          Object.entries(prop.properties).forEach(([key, value]) => {
            const isPropRequired = Array.isArray(prop.required)
              ? prop.required.includes(key)
              : prop.required ?? false;
            const propType = generateTsType(value, key);
            interfaceContent += `  ${key}${
              isPropRequired ? "" : "?"
            }: ${propType};\n`;
          });

          interfaceContent += "}\n\n";

          interfaces.push(interfaceContent);
          interfaceMap.set(interfaceKey, interfaceName);

          return interfaceName;
        }
        return "Record<string, unknown>";

      default:
        return "unknown";
    }
  };

  let rootInterface = `export interface ${rootName} {\n`;

  Object.entries(schema.properties).forEach(([key, value]) => {
    const isRequired = schema.required?.includes(key) ?? false;
    const propType = generateTsType(value, key);
    rootInterface += `  ${key}${isRequired ? "" : "?"}: ${propType};\n`;
  });

  rootInterface += "}\n\n";

  interfaces.unshift(rootInterface);

  return interfaces.join("\n");
};
/**
 * 예시 사용법
 */
export const exampleUsage = () => {
  const exampleSchema: SchemaInfo = {
    schema: "#/components/schemas/UserBoardResponseDto",
    typeName: "UserBoardResponseDto",
    properties: {
      id: {
        type: "integer",
        description: "게시글 ID",
        format: "int32",
        example: 1,
      },
      user_id: {
        type: "integer",
        description: "사용자 ID",
        format: "int32",
        example: 1,
      },
      title: {
        type: "string",
        description: "게시글 제목",
        example: "User",
        enum: ["User", "Admin"],
      },
      content: {
        type: "string",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
      },
      boardSort: {
        type: "object",
        properties: {
          key: {
            type: "string",
            description: "정렬 키",
            example: "createdAt",
          },
          name: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                description: "이름 ID",
                format: "int32",
                example: 1,
              },
              userName: {
                type: "string",
                description: "사용자 이름",
                example: "John Doe",
              },
              userRole: {
                type: "string",
                description: "사용자 역할",
                example: "ADMIN",
                enum: ["USER", "ADMIN", "MODERATOR"],
              },
              userLevel: {
                type: "string",
                description: "사용자 등급",
                example: "GOLD",
                enum: ["BRONZE", "SILVER", "GOLD", "PLATINUM"],
              },
              profileImageUrl: {
                type: "string",
                description: "프로필 이미지 URL",
                example: "https://example.com/avatar.jpg",
              },
              metadata: {
                type: "object",
                additionalProperties: {
                  type: "string",
                  description: "사용자 메타데이터",
                },
                description: "사용자 메타데이터",
              },
            },
            required: [
              "id",
              "metadata",
              "profileImageUrl",
              "userLevel",
              "userName",
              "userRole",
            ],
            $ref: "#/components/schemas/NameInfo",
          },
          sortType: {
            type: "string",
            description: "정렬 타입",
            example: "ASC",
            enum: ["ASC", "DESC"],
          },
          priority: {
            type: "integer",
            description: "우선순위",
            format: "int32",
            example: 1,
          },
          isActive: {
            type: "boolean",
            description: "활성화 여부",
            example: true,
          },
          price: {
            type: "number",
            description: "가격",
            example: 99.99,
          },
          createdDate: {
            type: "string",
            description: "생성 날짜",
            format: "date",
            example: "2025-01-15",
          },
          modifiedAt: {
            type: "string",
            description: "수정 시간",
            format: "date-time",
          },
          additionalProperties: {
            type: "object",
            additionalProperties: {
              type: "object",
              description: "추가 속성들",
            },
            description: "추가 속성들",
          },
        },
        required: [
          "additionalProperties",
          "createdDate",
          "isActive",
          "key",
          "modifiedAt",
          "name",
          "price",
          "priority",
          "sortType",
        ],
        $ref: "#/components/schemas/BoardSort",
      },
      tags: {
        type: "array",
        description: "태그 목록",
        example: ["spring", "java", "backend"],
        items: {
          type: "string",
          description: "태그 목록",
          example: '["spring","java","backend"]',
        },
      },
      likeCounts: {
        type: "array",
        description: "좋아요 수 목록",
        example: [1, 5, 10],
        items: {
          type: "integer",
          description: "좋아요 수 목록",
          format: "int32",
        },
      },
      boardSorts: {
        type: "array",
        description: "게시글 정렬 정보 배열",
        items: {
          type: "object",
          properties: {
            key: {
              type: "string",
              description: "정렬 키",
              example: "createdAt",
            },
            name: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  description: "이름 ID",
                  format: "int32",
                  example: 1,
                },
                userName: {
                  type: "string",
                  description: "사용자 이름",
                  example: "John Doe",
                },
                userRole: {
                  type: "string",
                  description: "사용자 역할",
                  example: "ADMIN",
                  enum: ["USER", "ADMIN", "MODERATOR"],
                },
                userLevel: {
                  type: "string",
                  description: "사용자 등급",
                  example: "GOLD",
                  enum: ["BRONZE", "SILVER", "GOLD", "PLATINUM"],
                },
                profileImageUrl: {
                  type: "string",
                  description: "프로필 이미지 URL",
                  example: "https://example.com/avatar.jpg",
                },
                metadata: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                    description: "사용자 메타데이터",
                  },
                  description: "사용자 메타데이터",
                },
              },
              required: [
                "id",
                "metadata",
                "profileImageUrl",
                "userLevel",
                "userName",
                "userRole",
              ],
              $ref: "#/components/schemas/NameInfo",
            },
            sortType: {
              type: "string",
              description: "정렬 타입",
              example: "ASC",
              enum: ["ASC", "DESC"],
            },
            priority: {
              type: "integer",
              description: "우선순위",
              format: "int32",
              example: 1,
            },
            isActive: {
              type: "boolean",
              description: "활성화 여부",
              example: true,
            },
            price: {
              type: "number",
              description: "가격",
              example: 99.99,
            },
            createdDate: {
              type: "string",
              description: "생성 날짜",
              format: "date",
              example: "2025-01-15",
            },
            modifiedAt: {
              type: "string",
              description: "수정 시간",
              format: "date-time",
            },
            additionalProperties: {
              type: "object",
              additionalProperties: {
                type: "object",
                description: "추가 속성들",
              },
              description: "추가 속성들",
            },
          },
          required: [
            "additionalProperties",
            "createdDate",
            "isActive",
            "key",
            "modifiedAt",
            "name",
            "price",
            "priority",
            "sortType",
          ],
          $ref: "#/components/schemas/BoardSort",
        },
      },
      status: {
        type: "string",
        description: "게시글 상태",
        example: "PUBLISHED",
        enum: ["DRAFT", "PUBLISHED", "ARCHIVED", "DELETED"],
      },
      viewCount: {
        type: "integer",
        description: "조회수",
        format: "int64",
        example: 1000,
      },
      rating: {
        type: "number",
        description: "평점",
        format: "double",
        example: 4.5,
      },
      price: {
        type: "number",
        description: "정밀한 가격",
        example: 99.99,
      },
      category: {
        type: "string",
        description: "게시글 카테고리",
        example: "TECHNOLOGY",
        enum: ["TECHNOLOGY", "LIFESTYLE", "SPORTS", "ENTERTAINMENT"],
      },
      createdDate: {
        type: "string",
        description: "생성 날짜",
        format: "date",
        example: "2025-01-15",
      },
      metadata: {
        type: "object",
        additionalProperties: {
          type: "object",
          description: "게시글 메타데이터",
        },
        description: "게시글 메타데이터",
      },
      settings: {
        type: "object",
        additionalProperties: {
          type: "string",
          description: "게시글 설정",
        },
        description: "게시글 설정",
      },
      statistics: {
        type: "object",
        additionalProperties: {
          type: "integer",
          description: "게시글 통계",
          format: "int32",
        },
        description: "게시글 통계",
      },
      imageUrls: {
        type: "array",
        description: "게시글 이미지 URL 배열",
        example: [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg",
        ],
        items: {
          type: "string",
          description: "게시글 이미지 URL 배열",
          example:
            '["https://example.com/image1.jpg","https://example.com/image2.jpg"]',
        },
      },
      commentIds: {
        type: "array",
        description: "게시글 댓글 ID 배열",
        example: [1, 2, 3, 4, 5],
        items: {
          type: "integer",
          description: "게시글 댓글 ID 배열",
          format: "int64",
        },
      },
      likedUserIds: {
        type: "array",
        description: "게시글 좋아요한 사용자 ID 배열",
        example: [1, 2, 3],
        items: {
          type: "integer",
          description: "게시글 좋아요한 사용자 ID 배열",
          format: "int32",
        },
      },
      isPublic: {
        type: "boolean",
        description: "게시글 공개 여부",
        example: true,
      },
      isPinned: {
        type: "boolean",
        description: "게시글 고정 여부",
        example: false,
      },
      priority: {
        type: "integer",
        description: "게시글 우선순위",
        format: "int32",
        example: 5,
      },
      version: {
        type: "string",
        description: "게시글 버전",
        example: "1.0",
      },
      language: {
        type: "string",
        description: "게시글 언어",
        example: "ko",
        enum: ["ko", "en", "ja", "zh"],
      },
      region: {
        type: "string",
        description: "게시글 지역",
        example: "KR",
        enum: ["KR", "US", "JP", "CN"],
      },
    },
    required: [
      "boardSort",
      "boardSorts",
      "category",
      "commentIds",
      "createdDate",
      "id",
      "imageUrls",
      "isPinned",
      "isPublic",
      "language",
      "likeCounts",
      "likedUserIds",
      "metadata",
      "price",
      "priority",
      "rating",
      "region",
      "settings",
      "statistics",
      "status",
      "tags",
      "title",
      "user_id",
      "version",
      "viewCount",
    ],
    type: "object",
  };

  return openApiToTs(exampleSchema, "Response");
};
