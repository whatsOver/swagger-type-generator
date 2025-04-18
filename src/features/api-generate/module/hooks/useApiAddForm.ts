import {
  EnhancedApiAdd,
  Param as InputParam, // Rename InputParam to avoid conflict with internal Param type if needed
  RequestBodyInput,
  SimpleSchema,
  SimpleSchemaProperty,
} from "@/entities/api/model/types/apiAdd"; // Assuming types are here
import { ContentType } from "@/entities/swagger/types";
import { Method } from "axios";
import { useCallback, useState } from "react";
import { v4 as uuidV4 } from "uuid"; // For generating unique IDs
import { ManagedItem, useListManager } from "./useListManager";

// --- Type Definitions for Form State ---

export interface FormParam extends ManagedItem, Omit<InputParam, "name"> {
  name: string;
}

export interface FormSchemaProperty extends ManagedItem, SimpleSchemaProperty {
  name: string;
  isRequired: boolean;
}

export interface FormResponse extends ManagedItem {
  statusCode: string;
  description: string;
  contentType: ContentType;
  schema: SimpleSchema;
  schemaProperties: FormSchemaProperty[];
}

// --- Default Values ---

const defaultParam: Omit<FormParam, "id"> = {
  name: "",
  in: "query", // Default 'in' value
  description: "",
  required: false,
  type: "string", // Default type
  format: undefined,
};

const defaultSchemaProperty: Omit<FormSchemaProperty, "id"> = {
  name: "",
  type: "string",
  format: undefined,
  description: "",
  example: "",
  isRequired: false,
};

// const defaultRequestBodySchema: SimpleSchema = {
//   type: "object",
//   properties: {},
//   required: [],
// };

const defaultResponse: Omit<FormResponse, "id" | "schemaProperties"> = {
  statusCode: "200",
  description: "OK",
  contentType: "application/json",
  schema: { type: "object", properties: {} },
};

export const useApiAddForm = () => {
  // --- Basic Info State ---
  const [method, setMethod] = useState<Method>("GET");
  const [path, setPath] = useState(""); // endpoint -> path
  const [summary, setSummary] = useState(""); // For MetaData
  const [description, setDescription] = useState(""); // For MetaData
  const [tags, setTags] = useState<string[]>([]); // For MetaData

  // --- Parameters State ---
  const {
    items: parameters, // Rename for clarity
    addItem: addParameter,
    removeItem: removeParameter,
    updateItem: updateParameter,
  } = useListManager<FormParam>();

  // --- Request Body State ---
  const [requestBodyRequired, setRequestBodyRequired] = useState(false);
  const [requestBodyContentType, setRequestBodyContentType] =
    useState<ContentType>("application/json");
  const [requestBodyDescription, setRequestBodyDescription] = useState("");

  const {
    items: requestBodySchemaProps,
    addItem: addRequestBodySchemaProp,
    removeItem: removeRequestBodySchemaProp,
    updateItem: updateRequestBodySchemaProp,
  } = useListManager<FormSchemaProperty>();

  // --- Responses State ---
  const {
    items: responses,
    addItem: addResponse,
    removeItem: removeResponse,
    updateItem: updateResponse,
  } = useListManager<FormResponse>();

  const handleAddTag = useCallback(
    (tag: string) => {
      if (tag && !tags.includes(tag)) {
        setTags((prev) => [...prev, tag.trim()]);
      }
    },
    [tags]
  );

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  }, []);

  // Parameter Handlers
  const handleAddParameter = useCallback(
    () => addParameter(defaultParam),
    [addParameter]
  );

  const handleRemoveParameter = useCallback(
    (id: string) => removeParameter(id),
    [removeParameter]
  );

  const handleParameterChange = useCallback(
    (id: string, field: keyof Omit<FormParam, "id">, value: any) => {
      updateParameter(id, field, value);
    },
    [updateParameter]
  );

  // Request Body Schema Property Handlers
  const handleAddRequestBodySchemaProp = useCallback(
    () => addRequestBodySchemaProp(defaultSchemaProperty),
    [addRequestBodySchemaProp]
  );
  const handleRemoveRequestBodySchemaProp = useCallback(
    (id: string) => removeRequestBodySchemaProp(id),
    [removeRequestBodySchemaProp]
  );
  const handleRequestBodySchemaPropChange = useCallback(
    (id: string, field: keyof Omit<FormSchemaProperty, "id">, value: any) => {
      updateRequestBodySchemaProp(id, field, value);
    },
    [updateRequestBodySchemaProp]
  );

  // Response Handlers
  const handleAddResponse = useCallback(() => {
    const newId = uuidV4();

    addResponse({ ...defaultResponse, id: newId, schemaProperties: [] });
  }, [addResponse]);

  const handleRemoveResponse = useCallback(
    (id: string) => removeResponse(id),
    [removeResponse]
  );

  const handleResponseChange = useCallback(
    // Update response metadata
    (
      id: string,
      field: keyof Omit<FormResponse, "id" | "schemaProperties">,
      value: any
    ) => {
      updateResponse(id, field, value);
    },
    [updateResponse]
  );

  const handleAddResponseSchemaProp = useCallback(
    (responseId: string) => {
      const newPropId = uuidV4();
      updateResponse(
        responseId,
        "schemaProperties",
        (prevProps: FormSchemaProperty[] = []) => [
          ...prevProps,
          { ...defaultSchemaProperty, id: newPropId },
        ]
      );
    },
    [updateResponse]
  );

  const handleRemoveResponseSchemaProp = useCallback(
    (responseId: string, propId: string) => {
      updateResponse(
        responseId,
        "schemaProperties",
        (prevProps: FormSchemaProperty[]) =>
          prevProps.filter((prop) => prop.id !== propId)
      );
    },
    [updateResponse]
  );

  const handleResponseSchemaPropChange = useCallback(
    (
      responseId: string,
      propId: string,
      field: keyof Omit<FormSchemaProperty, "id">,
      value: any
    ) => {
      updateResponse(
        responseId,
        "schemaProperties",
        (prevProps: FormSchemaProperty[]) =>
          prevProps.map((prop) =>
            prop.id === propId ? { ...prop, [field]: value } : prop
          )
      );
    },
    [updateResponse]
  );

  const getFormData = useCallback((): EnhancedApiAdd => {
    const builtRequestBodySchema: SimpleSchema = {
      type: "object", // Assuming object type for now
      properties: requestBodySchemaProps.reduce((acc, prop) => {
        acc[prop.name] = {
          type: prop.type,
          format: prop.format,
          description: prop.description,
          example: prop.example,
        };
        return acc;
      }, {} as { [key: string]: SimpleSchemaProperty }),
      required: requestBodySchemaProps
        .filter((prop) => prop.isRequired && prop.name)
        .map((prop) => prop.name),
    };

    const requestBody: RequestBodyInput | undefined =
      requestBodySchemaProps.length > 0
        ? {
            contentType: requestBodyContentType,
            required: requestBodyRequired,
            description: requestBodyDescription,
            schema: builtRequestBodySchema,
          }
        : undefined;

    const builtResponses = responses.reduce((acc, response) => {
      const responseSchemaProperties = response.schemaProperties || [];
      const builtResponseSchema: SimpleSchema = {
        type: "object", // Assuming object type for now
        properties: responseSchemaProperties.reduce((propsAcc, prop) => {
          propsAcc[prop.name] = {
            type: prop.type,
            format: prop.format,
            description: prop.description,
            example: prop.example,
          };
          return propsAcc;
        }, {} as { [key: string]: SimpleSchemaProperty }),
        required: responseSchemaProperties
          .filter((prop) => prop.isRequired && prop.name)
          .map((prop) => prop.name),
      };

      acc[response.statusCode] = {
        description: response.description,
        contentType: response.contentType,
        schema: builtResponseSchema,
      };
      return acc;
    }, {} as EnhancedApiAdd["responses"]);

    const apiParameters: InputParam[] = parameters.map(
      ({ id, ...rest }) => rest
    );

    return {
      method,
      path,
      summary,
      description,
      tags,
      parameters: apiParameters,
      requestBody,
      responses: builtResponses,
    };
  }, [
    method,
    path,
    summary,
    description,
    tags,
    parameters,
    requestBodyContentType,
    requestBodyRequired,
    requestBodyDescription,
    requestBodySchemaProps,
    responses,
  ]);

  return {
    // Basic Info
    method,
    setMethod,
    path,
    setPath,
    summary,
    setSummary,
    description,
    setDescription,
    tags,
    handleAddTag,
    handleRemoveTag,
    // Parameters
    parameters,
    handleAddParameter,
    handleRemoveParameter,
    handleParameterChange,
    // Request Body
    requestBodyRequired,
    setRequestBodyRequired,
    requestBodyContentType,
    setRequestBodyContentType,
    requestBodyDescription,
    setRequestBodyDescription,
    requestBodySchemaProps,
    handleAddRequestBodySchemaProp,
    handleRemoveRequestBodySchemaProp,
    handleRequestBodySchemaPropChange,
    // Responses
    responses,
    handleAddResponse,
    handleRemoveResponse,
    handleResponseChange,
    handleAddResponseSchemaProp,
    handleRemoveResponseSchemaProp,
    handleResponseSchemaPropChange,
    // Aggregation
    getFormData,
  };
};
