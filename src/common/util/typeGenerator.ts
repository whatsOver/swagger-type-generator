/* eslint-disable @typescript-eslint/no-explicit-any */

const toTsType = (value: any): string => {
  const jsType = typeof value;
  if (jsType === "number" || jsType === "boolean" || value === null)
    return jsType;
  else if (Array.isArray(value))
    return value.length > 0 ? `${toTsType(value[0])}[]` : "any[]";
  else if (jsType === "object") return "any";
  else return "string";
};

const jsonToTs = (
  key: string,
  json: object,
  parentIsArray = false
): string[] => {
  const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
  const interfaces = [
    `export interface ${parentIsArray ? capitalizedKey : capitalizedKey} {\n`,
  ];

  if (Array.isArray(json)) {
    if (typeof json[0] === "object") {
      interfaces.push(...jsonToTs(`${key}Item`, json[0], true));
      interfaces[0] += `  items: ${
        key.charAt(0).toUpperCase() + key.slice(1)
      }Item[];\n`;
    } else {
      interfaces[0] += `  items: ${toTsType(json[0])}[];\n`;
    }
  } else {
    for (const key in json) {
      if (Array.isArray(json[key]) && typeof json[key][0] === "object") {
        interfaces[0] += `  ${key}: ${
          key.charAt(0).toUpperCase() + key.slice(1)
        }[];\n`;
        interfaces.push(...jsonToTs(key, json[key][0], true));
      } else if (typeof json[key] === "object" && json[key] !== null) {
        interfaces[0] += `  ${key}: ${
          key.charAt(0).toUpperCase() + key.slice(1)
        };\n`;
        interfaces.push(...jsonToTs(key, json[key]));
      } else {
        interfaces[0] += `  ${key}: ${toTsType(json[key])};\n`;
      }
    }
  }

  interfaces[0] += "}";

  return interfaces;
};

export { toTsType, jsonToTs };
