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

export const openApiToZod = (
  schema: SchemaInfo,
  rootName = "Schema"
): string => {
  const schemas: string[] = [];
  const schemaMap = new Map<string, string>();

  const generateZodSchema = (prop: SchemasProperties, name: string): string => {
    // Enum 처리
    if (prop.enum) {
      const enumValues = prop.enum.map((v) => `"${v}"`).join(", ");
      return `z.enum([${enumValues}])`;
    }

    switch (prop.type) {
      case "string":
        if (prop.format === "date-time") return "z.string().datetime()";
        if (prop.format === "date") return "z.string().date()";
        if (prop.format === "password") return "z.string()";
        if (prop.format === "byte" || prop.format === "binary")
          return "z.instanceof(File)";
        return "z.string()";

      case "integer":
        return "z.number().int()";

      case "number":
        return "z.number()";

      case "boolean":
        return "z.boolean()";

      case "array":
        if (prop.items) {
          const itemSchema = generateZodSchema(prop.items, `${name}Item`);
          return `z.array(${itemSchema})`;
        }
        return "z.array(z.unknown())";

      case "object":
        if (prop.properties) {
          const schemaName = `${
            name.charAt(0).toUpperCase() + name.slice(1)
          }Schema`;
          const schemaKey = `${schemaName}Key`;

          if (schemaMap.has(schemaKey)) {
            return schemaName;
          }

          const schemaEntries = Object.entries(prop.properties)
            .map(([key, value]) => {
              const isRequired = Array.isArray(prop.required)
                ? prop.required.includes(key)
                : prop.required ?? false;
              const fieldSchema = generateZodSchema(value, key);
              const finalSchema = isRequired
                ? fieldSchema
                : `${fieldSchema}.optional()`;
              return `  ${key}: ${finalSchema}`;
            })
            .join(",\n");

          const zodSchema = `z.object({\n${schemaEntries}\n})`;

          schemaMap.set(schemaKey, schemaName);
          schemas.push(`const ${schemaName} = ${zodSchema};`);

          return schemaName;
        }
        return "z.record(z.unknown())";

      default:
        return "z.unknown()";
    }
  };

  // 루트 스키마 생성
  const rootSchemaEntries = Object.entries(schema.properties || {})
    .map(([key, value]) => {
      const isRequired = schema.required?.includes(key) ?? false;
      const fieldSchema = generateZodSchema(value, key);
      const finalSchema = isRequired
        ? fieldSchema
        : `${fieldSchema}.optional()`;
      return `  ${key}: ${finalSchema}`;
    })
    .join(",\n");

  const rootZodSchema = `z.object({\n${rootSchemaEntries}\n})`;
  const rootSchemaName = `${rootName}Schema`;

  schemas.push(`const ${rootSchemaName} = ${rootZodSchema};`);

  return schemas.join("\n\n");
};
