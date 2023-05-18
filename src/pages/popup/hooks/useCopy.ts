import React from "react";

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
          .then(() => alert("복사 완료"))
          .catch((error) => console.error("복사 실패 :", error));
      }
    }
  };

  return { copyToClipboard };
};

export default useCopy;
