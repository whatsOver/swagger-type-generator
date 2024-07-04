import React from "react";
import { toast } from "react-toastify";

interface Props {
  codeRef: React.RefObject<HTMLElement>;
}

const useCopy = ({ codeRef }: Props) => {
  const copyToClipboard = () => {
    if (codeRef.current) {
      const textToCopy = codeRef.current.textContent;
      if (textToCopy) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => toast.success("Copied!"))
          .catch((error) => toast.error("Copy Error :", error));
      }
    }
  };

  return { copyToClipboard };
};

export default useCopy;
