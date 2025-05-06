import Input from "@/shared/ui/Input";
import React from "react";
import { apiAddStyles } from "../ApiAdd.css";

interface ApiPathInputProps {
  path: string;
  setPath: (path: string) => void;
}

export const ApiPathInput: React.FC<ApiPathInputProps> = ({
  path,
  setPath,
}) => {
  return (
    <>
      <div className={apiAddStyles.row}>
        <span className={apiAddStyles.label}>Path</span>
      </div>
      <div className={apiAddStyles.row}>
        <Input
          placeholder="Enter request path (e.g., /users/{userId})"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className={apiAddStyles.inputField}
        />
      </div>
    </>
  );
};
