import { SchemaInfo } from "@/entities/swagger/types";
import { openApiToTs } from "./openApi";

describe("openApiToTs", () => {
  describe("기본 타입들", () => {
    it("string 타입을 올바르게 처리한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "StringSchema",
        properties: {
          name: {
            type: "string",
            description: "이름",
          },
        },
        required: ["name"],
        type: "object",
      };

      const result = openApiToTs(schema, "StringTest");

      expect(result).toEqual(
        "export interface StringTest {\n" + "  name: string;\n" + "}\n\n"
      );
    });

    it("integer 타입을 올바르게 처리한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "IntegerSchema",
        properties: {
          id: {
            type: "integer",
            format: "int32",
            description: "ID",
          },
        },
        required: ["id"],
        type: "object",
      };

      const result = openApiToTs(schema, "IntegerTest");

      expect(result).toEqual(
        "export interface IntegerTest {\n" + "  id: number;\n" + "}\n\n"
      );
    });

    it("number 타입을 올바르게 처리한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "NumberSchema",
        properties: {
          price: {
            type: "number",
            format: "double",
            description: "가격",
          },
        },
        required: ["price"],
        type: "object",
      };

      const result = openApiToTs(schema, "NumberTest");

      expect(result).toEqual(
        "export interface NumberTest {\n" + "  price: number;\n" + "}\n\n"
      );
    });

    it("boolean 타입을 올바르게 처리한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "BooleanSchema",
        properties: {
          isActive: {
            type: "boolean",
            description: "활성화 여부",
          },
        },
        required: ["isActive"],
        type: "object",
      };

      const result = openApiToTs(schema, "BooleanTest");

      expect(result).toEqual(
        "export interface BooleanTest {\n" + "  isActive: boolean;\n" + "}\n\n"
      );
    });
  });

  describe("특수 포맷 문자열", () => {
    it("date-time 포맷을 올바르게 처리한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "DateTimeSchema",
        properties: {
          createdAt: {
            type: "string",
            format: "date-time",
            description: "생성 시간",
          },
        },
        required: ["createdAt"],
        type: "object",
      };

      const result = openApiToTs(schema, "DateTimeTest");

      expect(result).toEqual(
        "export interface DateTimeTest {\n" + "  createdAt: string;\n" + "}\n\n"
      );
    });

    it("date 포맷을 올바르게 처리한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "DateSchema",
        properties: {
          birthDate: {
            type: "string",
            format: "date",
            description: "생년월일",
          },
        },
        required: ["birthDate"],
        type: "object",
      };

      const result = openApiToTs(schema, "DateTest");

      expect(result).toEqual(
        "export interface DateTest {\n" + "  birthDate: string;\n" + "}\n\n"
      );
    });

    it("password 포맷을 올바르게 처리한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "PasswordSchema",
        properties: {
          password: {
            type: "string",
            format: "password",
            description: "비밀번호",
          },
        },
        required: ["password"],
        type: "object",
      };

      const result = openApiToTs(schema, "PasswordTest");

      expect(result).toEqual(
        "export interface PasswordTest {\n" + "  password: string;\n" + "}\n\n"
      );
    });

    it("binary 포맷을 올바르게 처리한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "BinarySchema",
        properties: {
          file: {
            type: "string",
            format: "binary",
            description: "파일",
          },
        },
        required: ["file"],
        type: "object",
      };

      const result = openApiToTs(schema, "BinaryTest");

      expect(result).toEqual(
        "export interface BinaryTest {\n" + "  file: File;\n" + "}\n\n"
      );
    });
  });

  describe("배열 타입", () => {
    it("문자열 배열을 올바르게 처리한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "StringArraySchema",
        properties: {
          tags: {
            type: "array",
            items: {
              type: "string",
            },
            description: "태그 목록",
          },
        },
        required: ["tags"],
        type: "object",
      };

      const result = openApiToTs(schema, "StringArrayTest");

      expect(result).toEqual(
        "export interface StringArrayTest {\n" + "  tags: string[];\n" + "}\n\n"
      );
    });

    it("숫자 배열을 올바르게 처리한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "NumberArraySchema",
        properties: {
          scores: {
            type: "array",
            items: {
              type: "integer",
              format: "int32",
            },
            description: "점수 목록",
          },
        },
        required: ["scores"],
        type: "object",
      };

      const result = openApiToTs(schema, "NumberArrayTest");

      expect(result).toEqual(
        "export interface NumberArrayTest {\n" +
          "  scores: number[];\n" +
          "}\n\n"
      );
    });

    it("빈 배열을 올바르게 처리한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "EmptyArraySchema",
        properties: {
          emptyArray: {
            type: "array",
            description: "빈 배열",
          },
        },
        required: ["emptyArray"],
        type: "object",
      };

      const result = openApiToTs(schema, "EmptyArrayTest");

      expect(result).toEqual(
        "export interface EmptyArrayTest {\n" +
          "  emptyArray: unknown[];\n" +
          "}\n\n"
      );
    });
  });

  describe("Enum 타입", () => {
    it("문자열 enum을 올바르게 처리한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "EnumSchema",
        properties: {
          status: {
            type: "string",
            enum: ["ACTIVE", "INACTIVE", "PENDING"],
            description: "상태",
          },
        },
        required: ["status"],
        type: "object",
      };

      const result = openApiToTs(schema, "EnumTest");

      expect(result).toEqual(
        "export interface EnumTest {\n" +
          '  status: "ACTIVE" | "INACTIVE" | "PENDING";\n' +
          "}\n\n"
      );
    });

    it("숫자 enum을 올바르게 처리한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "NumberEnumSchema",
        properties: {
          priority: {
            type: "integer",
            enum: [1, 2, 3, 4, 5],
            description: "우선순위",
          },
        },
        required: ["priority"],
        type: "object",
      };

      const result = openApiToTs(schema, "NumberEnumTest");

      expect(result).toEqual(
        "export interface NumberEnumTest {\n" +
          '  priority: "1" | "2" | "3" | "4" | "5";\n' +
          "}\n\n"
      );
    });
  });

  describe("선택적 필드", () => {
    it("필수 필드와 선택 필드를 올바르게 구분한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "OptionalSchema",
        properties: {
          requiredField: {
            type: "string",
            description: "필수 필드",
          },
          optionalField: {
            type: "number",
            description: "선택 필드",
          },
        },
        required: ["requiredField"],
        type: "object",
      };

      const result = openApiToTs(schema, "OptionalTest");

      expect(result).toEqual(
        "export interface OptionalTest {\n" +
          "  requiredField: string;\n" +
          "  optionalField?: number;\n" +
          "}\n\n"
      );
    });

    it("모든 필드가 선택적인 경우를 처리한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "AllOptionalSchema",
        properties: {
          field1: {
            type: "string",
          },
          field2: {
            type: "number",
          },
        },
        required: [],
        type: "object",
      };

      const result = openApiToTs(schema, "AllOptionalTest");

      expect(result).toEqual(
        "export interface AllOptionalTest {\n" +
          "  field1?: string;\n" +
          "  field2?: number;\n" +
          "}\n\n"
      );
    });
  });

  describe("객체 타입", () => {
    it("빈 객체를 올바르게 처리한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "EmptyObjectSchema",
        properties: {
          emptyObject: {
            type: "object",
            description: "빈 객체",
          },
        },
        required: ["emptyObject"],
        type: "object",
      };

      const result = openApiToTs(schema, "EmptyObjectTest");

      expect(result).toEqual(
        "export interface EmptyObjectTest {\n" +
          "  emptyObject: Record<string, unknown>;\n" +
          "}\n\n"
      );
    });

    it("properties가 없는 객체를 올바르게 처리한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "NoPropertiesSchema",
        properties: {
          noProps: {
            type: "object",
            description: "속성이 없는 객체",
          },
        },
        required: ["noProps"],
        type: "object",
      };

      const result = openApiToTs(schema, "NoPropertiesTest");

      expect(result).toEqual(
        "export interface NoPropertiesTest {\n" +
          "  noProps: Record<string, unknown>;\n" +
          "}\n\n"
      );
    });
  });

  describe("알 수 없는 타입", () => {
    it("알 수 없는 타입을 올바르게 처리한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "UnknownSchema",
        properties: {
          unknownField: {
            type: "unknown" as any,
            description: "알 수 없는 타입",
          },
        },
        required: ["unknownField"],
        type: "object",
      };

      const result = openApiToTs(schema, "UnknownTest");

      expect(result).toEqual(
        "export interface UnknownTest {\n" +
          "  unknownField: unknown;\n" +
          "}\n\n"
      );
    });
  });

  describe("루트 인터페이스 이름", () => {
    it("기본 루트 이름을 사용한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "DefaultSchema",
        properties: {
          name: {
            type: "string",
          },
        },
        required: ["name"],
        type: "object",
      };

      const result = openApiToTs(schema);

      expect(result).toContain("export interface Interface {");
    });

    it("커스텀 루트 이름을 사용한다", () => {
      const schema: SchemaInfo = {
        schema: "inline",
        typeName: "CustomSchema",
        properties: {
          name: {
            type: "string",
          },
        },
        required: ["name"],
        type: "object",
      };

      const result = openApiToTs(schema, "CustomName");

      expect(result).toContain("export interface CustomName {");
    });
  });
});
