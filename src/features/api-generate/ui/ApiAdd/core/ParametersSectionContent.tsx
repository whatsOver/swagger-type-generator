import { FormParam } from "@/features/api-generate/module/hooks/useApiAddForm"; // Import type
import React from "react";
import { apiAddStyles } from "../ApiAdd.css";
import ParamItem from "./ParamItem";

interface ParametersSectionContentProps {
  parameters: FormParam[];
  onRemove: (id: string) => void;
  onChange: (
    id: string,
    field: keyof Omit<FormParam, "id">,
    value: any
  ) => void;
}

export const ParametersSectionContent: React.FC<
  ParametersSectionContentProps
> = ({ parameters, onRemove, onChange }) => {
  return (
    <>
      {parameters.length > 0 && (
        <div
          className={`${apiAddStyles.paramItem} ${apiAddStyles.paramItemHeader}`}
        >
          <div className={apiAddStyles.inputFieldSmallLabel}>Name</div>
          <div className={apiAddStyles.explanationContainer}>In</div>
          <div className={apiAddStyles.explanationContainer}>Type</div>
          <div className={apiAddStyles.inputFieldSmallLabel}>Description</div>
          <div className={apiAddStyles.explanationContainer}>Format</div>
          <div className={apiAddStyles.checkboxLabel}>Required</div>
          <div className={apiAddStyles.removeButtonPlaceholder}></div>
        </div>
      )}
      {parameters.map((param) => (
        <ParamItem
          key={param.id}
          item={param}
          onRemove={onRemove}
          onChange={onChange}
        />
      ))}
    </>
  );
};
