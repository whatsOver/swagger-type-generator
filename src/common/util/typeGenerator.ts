/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  SchemasProperties,
  SwaggerFormat,
  SwaggerType,
} from "@src/pages/popup/api/docs";
import { EMPTY_RESPONSE } from "@src/pages/popup/constants/status";

const isArrayType = (value: any): boolean =>
  typeof value === "string" && value.startsWith("[") && value.endsWith("]");

const checkArrayAndConvert = (value: any): any => {
  try {
    value = JSON.parse(value);
  } catch (error) {
    console.error(`Failed to parse JSON array: ${error}`);
  }
  return value;
};

const changeSwaggerTypeToTsType = (
  type: SwaggerType,
  format?: SwaggerFormat
): string => {
  switch (type) {
    case "integer":
    case "number":
      return "number";
    case "string":
      return "string";
    case "boolean":
      return "boolean";
    case "array":
      return changeSwaggerFormatToTsType(format) + "[]";
    default:
      return "unknown";
  }
};

const changeSwaggerFormatToTsType = (format: SwaggerFormat): string => {
  switch (format) {
    case "int32":
    case "int64":
    case "float":
    case "double":
      return "number";
    case "byte":
    case "binary":
      return "File";
    case "date":
    case "date-time":
      return "string";
    default:
      return "unknown";
  }
};

const getBodyProPertyType = (property: SchemasProperties) => {
  if (property.type === "array") {
    return changeSwaggerTypeToTsType(property.type, property.items.format);
  } else {
    return changeSwaggerTypeToTsType(property.type, property.format);
  }
};

const toTsType = (value: any): string => {
  if (isArrayType(value)) {
    value = checkArrayAndConvert(value);
  }
  const jsType = typeof value;

  if (jsType === "number" || jsType === "boolean") return jsType;
  else if (jsType === "object" && value === null) return "unknown";
  else if (Array.isArray(value)) {
    return value.length > 0 ? `${toTsType(value[0])}[]` : "unknown[]";
  } else if (jsType === "object") return "unknown";
  else return "string";
};

const jsonToTs = (
  key: string,
  json: object | any,
  parentIsArray = false
): { interfaceArray: string[]; rootInterfaceKey: string } => {
  if (json === EMPTY_RESPONSE)
    return { interfaceArray: [], rootInterfaceKey: "" };
  const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
  let interfaces = [];
  let rootInterfaceKey = capitalizedKey;

  if (Array.isArray(json)) {
    if (typeof json[0] === "object") {
      const result = jsonToTs(`${key}Item`, json[0], true);
      interfaces = result.interfaceArray;
      rootInterfaceKey = result.rootInterfaceKey;
    } else {
      interfaces.push(
        `export type ${capitalizedKey} = ${toTsType(json[0])}[];\n`
      );
    }
  } else {
    if (typeof json !== "object" || json === null) {
      interfaces.push(`export type ${capitalizedKey} = ${toTsType(json)};`);
      return { interfaceArray: interfaces, rootInterfaceKey };
    }
    interfaces.push(
      `export interface ${parentIsArray ? capitalizedKey : capitalizedKey} {\n`
    );
    for (const key in json) {
      if (Array.isArray(json[key]) && typeof json[key][0] === "object") {
        interfaces[0] += `  ${key}: ${
          key.charAt(0).toUpperCase() + key.slice(1)
        }[];\n`;
        interfaces.push(...jsonToTs(key, json[key][0], true).interfaceArray);
      } else if (typeof json[key] === "object" && json[key] !== null) {
        interfaces[0] += `  ${key}: ${
          key.charAt(0).toUpperCase() + key.slice(1)
        };\n`;
        interfaces.push(...jsonToTs(key, json[key]).interfaceArray);
      } else {
        interfaces[0] += `  ${key}: ${toTsType(json[key])};\n`;
      }
    }
    interfaces[0] += "}";
  }

  return { interfaceArray: interfaces, rootInterfaceKey };
};

export { toTsType, getBodyProPertyType, jsonToTs };
