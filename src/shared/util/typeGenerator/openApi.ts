import { SchemaInfo, SchemasProperties } from "@/entities/swagger/types";

export const openApiToTs = (
  schema: SchemaInfo,
  rootName = "Interface"
): { interfaceArray: string[]; rootInterfaceKey: string } => {
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

  return {
    interfaceArray: interfaces,
    rootInterfaceKey: rootName,
  };
};
