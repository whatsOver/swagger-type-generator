import { EMPTY_RESPONSE } from "@/entities/api/config/status";
import {
  SchemasProperties,
  SwaggerFormat,
  SwaggerType,
} from "@/entities/swagger/types";

export const isArrayType = (value: any): boolean =>
  typeof value === "string" && value.startsWith("[") && value.endsWith("]");

export const checkArrayAndConvert = (value: any): any => {
  try {
    value = JSON.parse(value);
  } catch (error) {
    console.error(`Failed to parse JSON array: ${error}`);
  }
  return value;
};

export const changeSwaggerTypeToTsType = (
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

export const changeSwaggerFormatToTsType = (format: SwaggerFormat): string => {
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

export const getBodyProPertyType = (property: SchemasProperties) => {
  if (property.type === "array") {
    return changeSwaggerTypeToTsType(property.type, property.items.format);
  } else {
    return changeSwaggerTypeToTsType(property.type, property.format);
  }
};

export const toTsType = (value: any): string => {
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

export const jsonToTs = (
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

export const jsonToZod = (json: unknown, rootName = "Root"): string => {
  const schemas: string[] = [];
  const schemaMap = new Map<string, string>();

  const generateZodSchema = (obj: unknown, name: string): string => {
    if (obj === null) return "z.null()";
    if (obj === undefined) return "z.undefined()";

    const type = typeof obj;

    switch (type) {
      case "string":
        return "z.string()";
      case "number":
        return Number.isInteger(obj) ? "z.number().int()" : "z.number()";
      case "boolean":
        return "z.boolean()";
      case "object": {
        if (Array.isArray(obj)) {
          if (obj.length === 0) return "z.array(z.unknown())";
          const firstItem = obj[0];
          const itemSchema = generateZodSchema(firstItem, `${name}Item`);
          return `z.array(${itemSchema})`;
        }

        const entries = Object.entries(obj as Record<string, unknown>);
        const objKey = JSON.stringify(entries);

        if (schemaMap.has(objKey)) {
          const existingSchema = schemaMap.get(objKey);
          if (existingSchema) {
            return existingSchema;
          }
        }

        const schema = entries
          .map(([key, value]) => {
            const fieldSchema = generateZodSchema(value, key);
            const cleanKey = key.endsWith("?") ? key.slice(0, -1) : key;
            const isOptional = key.endsWith("?");
            const finalSchema = isOptional
              ? `${fieldSchema}.nullish()`
              : fieldSchema;
            return `  ${cleanKey}: ${finalSchema}`;
          })
          .join(",\n");

        const zodSchema = `z.object({\n${schema}\n})`;
        const schemaName = `${name}Schema`;

        schemaMap.set(objKey, schemaName);
        schemas.push(`const ${schemaName} = ${zodSchema};`);

        return schemaName;
      }
      default:
        return "z.unknown()";
    }
  };

  const rootSchema = generateZodSchema(json, rootName);

  if (
    !schemaMap.has(
      JSON.stringify(Object.entries(json as Record<string, unknown>))
    )
  ) {
    schemas.push(`const ${rootName}Schema = ${rootSchema};`);
  }

  return schemas.join("\n\n");
};
