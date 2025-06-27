import { ForwardRefRenderFunction, forwardRef } from "react";

import { Mode } from "@/pages/popup/pages/RequestPage/RequestPage";
import Button from "@/shared/ui/Button";
import { vars } from "@/shared/ui/styles/theme.css";
import { IoMdClose as CloseIcon } from "react-icons/io";
import { IoChevronBackOutline as BackIcon } from "react-icons/io5";
import CodeBlock from "../code-block/CodeBlock";
import { codeBlockModalStyles } from "./codeBlockModal.css";

interface CodeBlockProps {
  description: string;
  descriptionColor?: keyof typeof vars.color;
  code: string;
  mode: Mode;
  isModal?: boolean;
  onClose?: () => void;
  onClickBack?: () => void;
  onClickTS?: () => void;
  onClickCopy?: () => void;
  onClickAxios?: () => void;
  onClickFetch?: () => void;
  onClickZod?: () => void;
}

const CodeBlockView: ForwardRefRenderFunction<
  HTMLDivElement,
  CodeBlockProps
> = (
  {
    description = vars.color.green,
    descriptionColor,
    code,
    mode,
    isModal = true,
    onClose,
    onClickBack,
    onClickTS,
    onClickCopy,
    onClickAxios,
    onClickFetch,
    onClickZod,
  },
  ref
) => {
  return (
    <div
      style={{ width: isModal ? "80vw" : "auto" }}
      className={codeBlockModalStyles.modal}
    >
      <div className={codeBlockModalStyles.response}>
        <div className={codeBlockModalStyles.descriptionWrapper}>
          <div className={codeBlockModalStyles.leftWrapper}>
            {!!isModal && (
              <>
                <button
                  onClick={() => {
                    mode === "RESPONSE" && onClose && onClose();
                    mode !== "RESPONSE" && onClickBack && onClickBack();
                  }}
                  className={codeBlockModalStyles.iconButton}
                  type="button"
                >
                  {mode === "RESPONSE" && (
                    <CloseIcon size={24} color={vars.color.white} />
                  )}
                  {mode !== "RESPONSE" && (
                    <BackIcon size={24} color={vars.color.white} />
                  )}
                </button>

                <h3
                  className={codeBlockModalStyles.requestDescription}
                  style={{
                    color: vars.color[descriptionColor],
                  }}
                >
                  {description}
                </h3>
              </>
            )}
            {!isModal && mode !== "RESPONSE" && (
              <>
                <button
                  onClick={() => {
                    onClickBack && onClickBack();
                  }}
                  className={codeBlockModalStyles.iconButton}
                  type="button"
                >
                  <BackIcon size={24} color={vars.color.white} />
                </button>
              </>
            )}
            {!isModal && (
              <h3
                className={codeBlockModalStyles.requestDescription}
                style={{
                  color: vars.color[descriptionColor],
                }}
              >
                {description}
              </h3>
            )}
          </div>
          <div className={codeBlockModalStyles.buttonWrapper}>
            {onClickCopy && (
              <Button color="green" onClick={onClickCopy}>
                COPY
              </Button>
            )}
            {onClickTS && (
              <Button color="blue" onClick={onClickTS}>
                TS
              </Button>
            )}
            {onClickAxios && (
              <Button color="red" onClick={onClickAxios}>
                Axios
              </Button>
            )}
            {onClickFetch && (
              <Button color="orange" onClick={onClickFetch}>
                Fetch
              </Button>
            )}
            {onClickZod && (
              <Button color="purple" onClick={onClickZod}>
                Zod
              </Button>
            )}
          </div>
        </div>
        <CodeBlock ref={ref} code={code} />
      </div>
    </div>
  );
};

export default forwardRef(CodeBlockView);
