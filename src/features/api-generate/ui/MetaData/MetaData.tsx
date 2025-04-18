import { apiListStyle } from "@/pages/popup/pages/ApiListPage/ui/apiList.css";
import { DocsApiListFunnelProps } from "@/pages/popup/pages/DocsApiListFunnel/DocsApiListFunnel";
import Button from "@/shared/ui/Button";
import BottomFixedButton from "@/shared/ui/Button/BottomFixedButton";
import Header from "@/shared/ui/Header";
import Input from "@/shared/ui/Input";
import React, { KeyboardEvent, useState } from "react";
import { useApiAddForm } from "../../module/hooks/useApiAddForm";
import { metaDataStyles } from "./MetaData.css";

interface MetaDataProps extends DocsApiListFunnelProps {
  form: ReturnType<typeof useApiAddForm>;
  onNext: () => void;
}

export const MetaData = ({ form, onNext }: MetaDataProps) => {
  const {
    summary,
    setSummary,
    description,
    setDescription,
    tags,
    handleAddTag,
    handleRemoveTag,
  } = form;

  const [currentTag, setCurrentTag] = useState("");

  const handleTagInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && currentTag.trim()) {
      event.preventDefault();
      handleAddTag(currentTag.trim());
      setCurrentTag("");
    }
  };

  const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTag(event.target.value);
  };

  return (
    <div id="main" className={apiListStyle.app}>
      <Header showBackButton headerTitle="API Spec - Metadata" />
      <div className={metaDataStyles.content}>
        <div className={metaDataStyles.row}>
          <span className={metaDataStyles.label}>Summary *</span>
          <Input
            autoFocus
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Enter API summary (e.g., Get user details)"
            className={metaDataStyles.input}
          />
        </div>
        <div className={metaDataStyles.row}>
          <span className={metaDataStyles.label}>Description</span>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter detailed description (optional)"
            className={metaDataStyles.input}
          />
        </div>
        <div className={metaDataStyles.row} style={{ flexDirection: "column" }}>
          <span className={metaDataStyles.tagLabel}>Tags</span>
          <div className={metaDataStyles.tagInputContainer}>
            <Input
              value={currentTag}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add tags and press Enter"
              className={metaDataStyles.input}
            />
            <div className={metaDataStyles.tagList}>
              {tags.map((tag) => (
                <span key={tag} className={metaDataStyles.tagItem}>
                  {tag}
                  <Button
                    color="red"
                    onClick={() => handleRemoveTag(tag)}
                    style={{
                      marginLeft: "5px",
                      cursor: "pointer",
                      padding: "4px",
                      height: "16px",
                      width: "16px",
                      fontSize: "12px",
                      lineHeight: "1",
                    }}
                  >
                    &times;
                  </Button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <BottomFixedButton>
        <BottomFixedButton.First onClick={onNext} disabled={!summary}>
          NEXT
        </BottomFixedButton.First>
      </BottomFixedButton>
    </div>
  );
};
