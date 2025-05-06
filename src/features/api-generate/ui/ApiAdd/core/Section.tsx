import React, { ReactNode } from "react";

import Button from "@/shared/ui/Button";
import { apiAddStyles } from "../ApiAdd.css";

interface SectionProps {
  title: string;
  labelStyle: string;
  buttonColor: "green" | "blue";
  children: ReactNode;
  onAdd: () => void;
}

const Section: React.FC<SectionProps> = ({
  title,
  labelStyle,
  buttonColor,
  children,
  onAdd,
}) => {
  return (
    <div className={apiAddStyles.section}>
      <div className={apiAddStyles.sectionHeader}>
        <span className={labelStyle}>{title}</span>
        <Button color={buttonColor} onClick={onAdd}>
          ADD
        </Button>
      </div>
      {children}
    </div>
  );
};

export default Section;
