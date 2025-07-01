import { SchemaInfo, SchemasProperties } from "@/entities/swagger/types";

export const openApiToTs = (
  schema: SchemaInfo,
  rootName = "Interface"
): { interfaceArray: string[]; rootInterfaceKey: string } => {
  const interfaces: string[] = [];
  const interfaceMap = new Map<string, string>();

  const generateTsType = (prop: SchemasProperties, name: string): string => {
    if (prop.oneOf && Array.isArray(prop.oneOf)) {
      return prop.oneOf.map((item) => generateTsType(item, name)).join(" | ");
    }
    if (prop.anyOf && Array.isArray(prop.anyOf)) {
      return prop.anyOf.map((item) => generateTsType(item, name)).join(" | ");
    }
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
          if (prop.items.oneOf && Array.isArray(prop.items.oneOf)) {
            const unionType = prop.items.oneOf
              .map((item) => generateTsType(item, `${name}Item`))
              .join(" | ");
            return `(${unionType})[]`;
          }
          if (prop.items.anyOf && Array.isArray(prop.items.anyOf)) {
            const unionType = prop.items.anyOf
              .map((item) => generateTsType(item, `${name}Item`))
              .join(" | ");
            return `(${unionType})[]`;
          }
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

export const openApiToZod = (
  schema: SchemaInfo,
  rootName = "Schema"
): string => {
  const schemas: string[] = [];
  const schemaMap = new Map<string, string>();

  const generateZodSchema = (prop: SchemasProperties, name: string): string => {
    if (prop.oneOf && Array.isArray(prop.oneOf)) {
      const unionSchemas = prop.oneOf
        .map((item) => generateZodSchema(item, name))
        .join(", ");
      return `z.union([${unionSchemas}])`;
    }
    if (prop.anyOf && Array.isArray(prop.anyOf)) {
      const unionSchemas = prop.anyOf
        .map((item) => generateZodSchema(item, name))
        .join(", ");
      return `z.union([${unionSchemas}])`;
    }
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
          if (prop.items.oneOf && Array.isArray(prop.items.oneOf)) {
            const unionSchemas = prop.items.oneOf
              .map((item) => generateZodSchema(item, `${name}Item`))
              .join(", ");
            return `z.array(z.union([${unionSchemas}]))`;
          }
          if (prop.items.anyOf && Array.isArray(prop.items.anyOf)) {
            const unionSchemas = prop.items.anyOf
              .map((item) => generateZodSchema(item, `${name}Item`))
              .join(", ");
            return `z.array(z.union([${unionSchemas}]))`;
          }
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
