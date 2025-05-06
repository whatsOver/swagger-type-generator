import Button from "@/shared/ui/Button";
import { vars } from "@/shared/ui/styles/theme.css";
import React from "react";
import { FiX as CloseIcon } from "react-icons/fi"; // Import close icon
import { addItemStyles } from "./docsAddItem.css";

interface DocsAddItemProps {
  title: string;
  description: string;
  color: string;
  onChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDescription: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeColor: (color: string) => void;
  onPressEnter: () => void; // Triggered on Enter in title input
  onClickClose: () => void;
}

const COLOR_LIST = [
  vars.color.red,
  vars.color.orange,
  vars.color.yellow,
  vars.color.green,
  vars.color.blue,
  vars.color.purple,
  vars.color.darkGrey,
  vars.color.lightGrey,
];

export const DocsAddItem: React.FC<DocsAddItemProps> = ({
  title,
  description,
  color: selectedColor,
  onChangeTitle,
  onChangeDescription,
  onChangeColor,
  onPressEnter,
  onClickClose,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onPressEnter();
    }
  };

  return (
    <div className={addItemStyles.container}>
      <button className={addItemStyles.closeButton} onClick={onClickClose}>
        <CloseIcon size={20} color={vars.color.white} />
      </button>
      <input
        type="text"
        placeholder="Enter document title"
        value={title}
        onChange={onChangeTitle}
        onKeyDown={handleKeyDown} // Add keydown listener
        className={addItemStyles.input}
        autoFocus // Automatically focus the title input
      />
      <textarea
        placeholder="Enter description (optional)"
        value={description}
        onChange={onChangeDescription}
        className={addItemStyles.textarea}
      />
      <div className={addItemStyles.colorList}>
        {COLOR_LIST.map((color) => (
          <button
            key={color}
            className={addItemStyles.colorItem}
            style={{
              backgroundColor: color,
              border:
                color === selectedColor
                  ? `2px solid ${vars.color.white}`
                  : "none",
            }}
            onClick={() => onChangeColor(color)}
          />
        ))}
      </div>
      <Button onClick={onPressEnter} color="purpleLarge">
        Add Document
      </Button>
    </div>
  );
};
