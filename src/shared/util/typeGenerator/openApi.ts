import { SchemaInfo, SchemasProperties } from "@/entities/swagger/types";

export const openApiToTs = (
  schema: SchemaInfo,
  rootName = "Interface",
  schemasMap?: Record<string, SchemasProperties | SchemaInfo>
): { interfaceArray: string[]; rootInterfaceKey: string } => {
  const interfaces: string[] = [];
  const interfaceMap = new Map<string, string>();

  const generateTsType = (
    prop: SchemasProperties | SchemaInfo,
    name: string,
    schemasMap?: Record<string, SchemasProperties | SchemaInfo>
  ): string => {
    if ((prop as any).$ref) {
      const ref = (prop as any).$ref;
      const typeName = ref.split("/").pop();
      if (
        typeName &&
        !interfaceMap.has(`${typeName}Interface`) &&
        schemasMap &&
        schemasMap[typeName]
      ) {
        generateTsType(schemasMap[typeName], typeName, schemasMap);
      }
      return typeName || "unknown";
    }
    if ((prop as any).oneOf && Array.isArray((prop as any).oneOf)) {
      const types = (prop as any).oneOf.map((item: any) => {
        if (item.type === "null") return "null";
        return generateTsType(item, name, schemasMap);
      });
      const filtered = types.filter((t: string) => t !== "null");
      return filtered.join(" | ") + (types.includes("null") ? " | null" : "");
    }
    if ((prop as any).anyOf && Array.isArray((prop as any).anyOf)) {
      const types = (prop as any).anyOf.map((item: any) => {
        if (item.type === "null") return "null";
        return generateTsType(item, name, schemasMap);
      });
      const filtered = types.filter((t: string) => t !== "null");
      return filtered.join(" | ") + (types.includes("null") ? " | null" : "");
    }
    if ((prop as any).enum) {
      const enumValues = (prop as any).enum
        .map((v: any) => `"${v}"`)
        .join(" | ");
      return enumValues;
    }

    switch (prop.type) {
      case "string": {
        let baseType = "string";
        if ((prop as any).format === "date-time") baseType = "string";
        if ((prop as any).format === "date") baseType = "string";
        if ((prop as any).format === "password") baseType = "string";
        if (
          (prop as any).format === "byte" ||
          (prop as any).format === "binary"
        )
          baseType = "File";
        // nullable 처리
        if ((prop as any).nullable) baseType += " | null";
        return baseType;
      }

      case "integer":
      case "number":
        return "number";

      case "boolean":
        return "boolean";

      case "array":
        if (prop.items) {
          if (
            (prop.items as any).typeName &&
            (prop.items as any).typeName !== "inline"
          ) {
            generateTsType(
              prop.items as SchemasProperties | SchemaInfo,
              (prop.items as any).typeName,
              schemasMap
            );
            return `${(prop.items as any).typeName}[]`;
          }
          if (
            (prop.items as any).oneOf &&
            Array.isArray((prop.items as any).oneOf)
          ) {
            const unionType = (prop.items as any).oneOf
              .map((item: any) =>
                generateTsType(item, `${name}Item`, schemasMap)
              )
              .join(" | ");
            return `(${unionType})[]`;
          }
          if (
            (prop.items as any).anyOf &&
            Array.isArray((prop.items as any).anyOf)
          ) {
            const unionType = (prop.items as any).anyOf
              .map((item: any) =>
                generateTsType(item, `${name}Item`, schemasMap)
              )
              .join(" | ");
            return `(${unionType})[]`;
          }
          const itemType = generateTsType(
            prop.items as SchemasProperties | SchemaInfo,
            `${name}Item`,
            schemasMap
          );
          return `${itemType}[]`;
        }
        return "unknown[]";

      case "object": {
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
            const propType = generateTsType(value, key, schemasMap);
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
      }
      case "null":
        return "null";
      default:
        return "unknown";
    }
  };

  let rootInterface = "";

  if (schema.type === "array" && schema.items) {
    // oneOf
    if ("oneOf" in schema.items) {
      const unionTypes = schema.items.oneOf
        .map((item, idx) =>
          item.typeName && item.typeName !== "inline"
            ? (generateTsType(item, item.typeName, schemasMap), item.typeName)
            : generateTsType(item, rootName + "Item" + idx, schemasMap)
        )
        .join(" | ");
      rootInterface = `export type ${rootName} = (${unionTypes})[];\n\n`;
    }
    // anyOf
    else if ("anyOf" in schema.items) {
      const unionTypes = schema.items.anyOf
        .map((item, idx) =>
          item.typeName && item.typeName !== "inline"
            ? (generateTsType(item, item.typeName, schemasMap), item.typeName)
            : generateTsType(item, rootName + "Item" + idx, schemasMap)
        )
        .join(" | ");
      rootInterface = `export type ${rootName} = (${unionTypes})[];\n\n`;
    }
    // 단일 타입
    else if (
      (schema.items as SchemaInfo).typeName &&
      (schema.items as SchemaInfo).typeName !== "inline"
    ) {
      generateTsType(
        schema.items as SchemaInfo,
        (schema.items as SchemaInfo).typeName!,
        schemasMap
      );
      rootInterface = `export type ${rootName} = ${
        (schema.items as SchemaInfo).typeName
      }[];\n\n`;
    } else {
      const itemType = generateTsType(
        schema.items as SchemasProperties | SchemaInfo,
        rootName + "Item",
        schemasMap
      );
      rootInterface = `export type ${rootName} = ${itemType}[];\n\n`;
    }
  } else {
    rootInterface = `export interface ${rootName} {\n`;
    Object.entries(schema.properties || {}).forEach(([key, value]) => {
      const isRequired = schema.required?.includes(key) ?? false;
      const propType = generateTsType(value, key, schemasMap);
      rootInterface += `  ${key}${isRequired ? "" : "?"}: ${propType};\n`;
    });
    rootInterface += "}\n\n";
  }

  interfaces.unshift(rootInterface);

  return {
    interfaceArray: interfaces,
    rootInterfaceKey: rootName,
  };
};

export const openApiToZod = (
  schema: SchemaInfo,
  rootName = "Schema",
  schemasMap?: Record<string, SchemasProperties | SchemaInfo>
): string => {
  const schemas: string[] = [];
  const schemaMap = new Map<string, string>();

  const generateZodSchema = (
    prop: SchemasProperties | SchemaInfo,
    name: string,
    schemasMap?: Record<string, SchemasProperties | SchemaInfo>
  ): string => {
    if ((prop as any).$ref) {
      const ref = (prop as any).$ref;
      const typeName = ref.split("/").pop();
      if (typeName && schemasMap && schemasMap[typeName]) {
        generateZodSchema(schemasMap[typeName], typeName, schemasMap);
      }
      return `${typeName}Schema`;
    }
    if ((prop as any).oneOf && Array.isArray((prop as any).oneOf)) {
      const schemas = (prop as any).oneOf.map((item: any) => {
        if (item.type === "null") return "null";
        return generateZodSchema(item, name, schemasMap);
      });
      const filtered = schemas.filter((s: string) => s !== "null");
      if (schemas.includes("null")) {
        return `z.union([${filtered.join(", ")}]).nullable()`;
      }
      return `z.union([${filtered.join(", ")}])`;
    }
    if ((prop as any).anyOf && Array.isArray((prop as any).anyOf)) {
      const schemas = (prop as any).anyOf.map((item: any) => {
        if (item.type === "null") return "null";
        return generateZodSchema(item, name, schemasMap);
      });
      const filtered = schemas.filter((s: string) => s !== "null");
      if (schemas.includes("null")) {
        return `z.union([${filtered.join(", ")}]).nullable()`;
      }
      return `z.union([${filtered.join(", ")}])`;
    }
    if ((prop as any).enum) {
      const enumValues = (prop as any).enum
        .map((v: any) => `"${v}"`)
        .join(", ");
      return `z.enum([${enumValues}])`;
    }

    switch (prop.type) {
      case "string":
        if ((prop as any).format === "date-time")
          return "z.string().datetime()";
        if ((prop as any).format === "date") return "z.string().date()";
        if ((prop as any).format === "password") return "z.string()";
        if (
          (prop as any).format === "byte" ||
          (prop as any).format === "binary"
        )
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
          if (
            (prop.items as any).typeName &&
            (prop.items as any).typeName !== "inline"
          ) {
            generateZodSchema(
              prop.items as SchemasProperties | SchemaInfo,
              (prop.items as any).typeName,
              schemasMap
            );
            return `z.array(${(prop.items as any).typeName}Schema)`;
          }
          if (
            (prop.items as any).oneOf &&
            Array.isArray((prop.items as any).oneOf)
          ) {
            const unionSchemas = (prop.items as any).oneOf
              .map((item: any) =>
                generateZodSchema(item, `${name}Item`, schemasMap)
              )
              .join(", ");
            return `z.array(z.union([${unionSchemas}]))`;
          }
          if (
            (prop.items as any).anyOf &&
            Array.isArray((prop.items as any).anyOf)
          ) {
            const unionSchemas = (prop.items as any).anyOf
              .map((item: any) =>
                generateZodSchema(item, `${name}Item`, schemasMap)
              )
              .join(", ");
            return `z.array(z.union([${unionSchemas}]))`;
          }
          const itemSchema = generateZodSchema(
            prop.items as SchemasProperties | SchemaInfo,
            `${name}Item`,
            schemasMap
          );
          return `z.array(${itemSchema})`;
        }
        return "z.array(z.unknown())";
      case "object": {
        const schemaName = `${
          name.charAt(0).toUpperCase() + name.slice(1)
        }Schema`;
        const schemaKey = `${schemaName}Key`;

        if (schemaMap.has(schemaKey)) {
          return schemaName;
        }

        const schemaEntries = Object.entries(prop.properties || {})
          .map(([key, value]) => {
            const isRequired = Array.isArray(prop.required)
              ? prop.required.includes(key)
              : prop.required ?? false;
            const fieldSchema = generateZodSchema(value, key, schemasMap);
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
      case "null":
        return "z.null()";
      default:
        return "z.unknown()";
    }
  };

  let rootSchema = "";

  if (schema.type === "array" && schema.items) {
    if (
      (schema.items as any).typeName &&
      (schema.items as any).typeName !== "inline"
    ) {
      generateZodSchema(
        schema.items as SchemasProperties | SchemaInfo,
        (schema.items as any).typeName,
        schemasMap
      );
      rootSchema = `const ${rootName}Schema = z.array(${
        (schema.items as any).typeName
      }Schema);`;
    } else {
      const itemSchema = generateZodSchema(
        schema.items as SchemasProperties | SchemaInfo,
        rootName + "Item",
        schemasMap
      );
      rootSchema = `const ${rootName}Schema = z.array(${itemSchema});`;
    }
  } else {
    const rootSchemaEntries = Object.entries(schema.properties || {})
      .map(([key, value]) => {
        const isRequired = schema.required?.includes(key) ?? false;
        const fieldSchema = generateZodSchema(value, key, schemasMap);
        const finalSchema = isRequired
          ? fieldSchema
          : `${fieldSchema}.optional()`;
        return `  ${key}: ${finalSchema}`;
      })
      .join(",\n");

    rootSchema = `const ${rootName}Schema = z.object({\n${rootSchemaEntries}\n})`;
  }

  schemas.push(rootSchema);

  return schemas.join("\n\n");
};
