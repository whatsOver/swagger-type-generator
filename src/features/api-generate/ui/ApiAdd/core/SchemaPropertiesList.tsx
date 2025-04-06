import { FormSchemaProperty } from "@/features/api-generate/module/hooks/useApiAddForm";
import React from "react";
import { apiAddStyles } from "../ApiAdd.css";
import SchemaPropertyItem from "./SchemaPropertyItem";

interface SchemaPropertiesListProps {
  properties: FormSchemaProperty[];
  onRemove: (id: string) => void;
  // Adjust onChange to potentially accept responseId if needed later
  onChange: (
    id: string,
    field: keyof Omit<FormSchemaProperty, "id">,
    value: any
  ) => void;
  // Add responseId prop if this is used for responses later
  // responseId?: string;
}

export const SchemaPropertiesList: React.FC<SchemaPropertiesListProps> = ({
  properties,
  onRemove,
  onChange,
}) => {
  return (
    <div className={apiAddStyles.schemaPropertiesList}>
      {properties.length > 0 && (
        <div
          className={`${apiAddStyles.paramItem} ${apiAddStyles.paramItemHeader}`}
        >
          <span className={apiAddStyles.inputFieldSmallLabel}>Name</span>
          <span className={apiAddStyles.inputFieldSmallLabel}>Type</span>
          <span className={apiAddStyles.inputFieldSmallLabel}>Format</span>
          <span className={apiAddStyles.inputFieldSmallLabel}>Description</span>
          <span className={apiAddStyles.inputFieldSmallLabel}>Example</span>
          <span className={apiAddStyles.checkboxLabel}>Required</span>
          <span className={apiAddStyles.removeButtonPlaceholder}></span>
        </div>
      )}
      {properties.map((prop) => (
        <SchemaPropertyItem
          key={prop.id}
          item={prop}
          onRemove={onRemove} // Pass onRemove directly for request body
          onChange={onChange} // Pass onChange directly for request body
          // For Responses, onChange might need currying or modification
          // onChange={(propId, field, value) => onChange(responseId, prop.id, field, value)}
        />
      ))}
    </div>
  );
};
