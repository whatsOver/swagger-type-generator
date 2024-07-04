import { vars } from "@/shared/ui/styles/theme.css";

import Button from "@/shared/ui/Button";
import { ForwardRefRenderFunction, forwardRef } from "react";
import { IoMdClose as CloseIcon } from "react-icons/io";
import { IoChevronBackOutline as BackIcon } from "react-icons/io5";
import { Mode } from "../pages/Request/Request";
import { requestStyle } from "../pages/Request/request.css";
import CodeBlock from "./CodeBlock";

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
  },
  ref
) => {
  return (
    <div
      style={{ width: isModal ? "80vw" : "auto" }}
      className={requestStyle.modal}
    >
      <div className={requestStyle.response}>
        <div className={requestStyle.descriptionWrapper}>
          <div className={requestStyle.leftWrapper}>
            {!!isModal && (
              <>
                <button
                  onClick={() => {
                    mode === "RESPONSE" && onClose && onClose();
                    mode !== "RESPONSE" && onClickBack && onClickBack();
                  }}
                  className={requestStyle.iconButton}
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
                  className={requestStyle.requestDescription}
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
                  className={requestStyle.iconButton}
                  type="button"
                >
                  <BackIcon size={24} color={vars.color.white} />
                </button>
              </>
            )}
            {!isModal && (
              <h3
                className={requestStyle.requestDescription}
                style={{
                  color: vars.color[descriptionColor],
                }}
              >
                {description}
              </h3>
            )}
          </div>
          <div className={requestStyle.buttonWrapper}>
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
          </div>
        </div>
        <CodeBlock ref={ref} code={code} />
      </div>
    </div>
  );
};

export default forwardRef(CodeBlockView);
