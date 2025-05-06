import { ContentType } from "@/entities/swagger/types";
import CheckBox from "@/shared/ui/CheckBox";
import Dropdown from "@/shared/ui/Dropdown";
import Input from "@/shared/ui/Input";
import React from "react";
import { BiChevronDown } from "react-icons/bi";
import { apiAddStyles } from "../ApiAdd.css";

const REQUEST_BODY_CONTENT_TYPES: ContentType[] = [
  "application/json",
  "multipart/form-data",
  "application/x-www-form-urlencoded",
];

interface RequestBodyMetadataProps {
  contentType: ContentType;
  setContentType: (contentType: ContentType) => void;
  required: boolean;
  setRequired: (required: boolean) => void;
  description: string;
  setDescription: (description: string) => void;
}

export const RequestBodyMetadata: React.FC<RequestBodyMetadataProps> = ({
  contentType,
  setContentType,
  required,
  setRequired,
  description,
  setDescription,
}) => {
  return (
    <div className={apiAddStyles.bodyMetaContainer}>
      <div className={apiAddStyles.bodyMetaItem}>
        <span className={apiAddStyles.labelSmall}>Content Type</span>
        <Dropdown>
          <Dropdown.Trigger
            as={
              <button
                className={apiAddStyles.paramTypeSelect}
                style={{ width: "100%" }}
              >
                <span className={apiAddStyles.paramText}>{contentType}</span>
                <BiChevronDown />
              </button>
            }
          ></Dropdown.Trigger>
          <Dropdown.Modal>
            {REQUEST_BODY_CONTENT_TYPES.map((ctype) => (
              <Dropdown.Item
                key={ctype}
                name={ctype}
                onClick={() => setContentType(ctype)}
              >
                {ctype}
              </Dropdown.Item>
            ))}
          </Dropdown.Modal>
        </Dropdown>
      </div>
      <div className={apiAddStyles.bodyCheckboxContainer}>
        <span className={apiAddStyles.labelSmall}>Required</span>
        <div
          className={apiAddStyles.checkboxContainer}
          style={{ justifyContent: "flex-start" }}
        >
          <CheckBox isChecked={required} onChange={setRequired} />
        </div>
      </div>
      <div
        className={`${apiAddStyles.bodyMetaItem} ${apiAddStyles.bodyMetaDescription}`}
      >
        <span className={apiAddStyles.labelSmall}>Description</span>
        <Input
          placeholder="Request body description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={apiAddStyles.inputField}
        />
      </div>
    </div>
  );
};
