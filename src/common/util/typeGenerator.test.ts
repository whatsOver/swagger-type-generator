import { jsonToTs, toTsType } from "./typeGenerator";

describe("toTsType", () => {
  it('타입이 숫자인 경우 "number"를 반환한다', () => {
    expect(toTsType(1)).toEqual("number");
  });

  it('타입이 불린인 경우 "boolean"를 반환한다', () => {
    expect(toTsType(true)).toEqual("boolean");
  });

  it('값이 null인 경우 "null"을 반환한다', () => {
    // js의 typeof null은 "object"이다
    expect(toTsType(null)).toEqual("object");
  });

  it("타입이 배열인 경우 배열 내의 첫 번째 요소 타입에 대한 배열 타입을 반환한다", () => {
    expect(toTsType([1, 2, 3])).toEqual("number[]");
    expect(toTsType(["a", "b", "c"])).toEqual("string[]");
    expect(toTsType([true, false])).toEqual("boolean[]");
  });

  it('타입이 객체인 경우 "any"를 반환한다', () => {
    expect(toTsType({ a: 1, b: 2 })).toEqual("any");
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
