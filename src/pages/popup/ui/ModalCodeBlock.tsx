import { requestStyle } from "./styles/request.css";
import Button from "@src/common/ui/Button";
import CodeBlock from "./CodeBlock";
import { vars } from "@src/common/ui/styles/theme.css";
import { ForwardRefRenderFunction } from "react";
import { forwardRef } from "react";
import { IoChevronBackOutline as BackIcon } from "react-icons/io5";
import { IoMdClose as CloseIcon } from "react-icons/io";
import { Mode } from "./Request";

interface ModalCodeBlockProps {
  description: string;
  descriptionColor?: keyof typeof vars.color;
  code: string;
  mode: Mode;
  onClose?: () => void;
  onClickBack?: () => void;
  onClickTS?: () => void;
  onClickCopy?: () => void;
  onClickAPI?: () => void;
}

const ModalCodeBlock: ForwardRefRenderFunction<
  HTMLDivElement,
  ModalCodeBlockProps
> = (
  {
    description = vars.color.green,
    descriptionColor,
    code,
    mode,
    onClose,
    onClickBack,
    onClickTS,
    onClickCopy,
    onClickAPI,
  },
  ref
) => {
  return (
    <div className={requestStyle.modal}>
      <div className={requestStyle.response}>
        <div className={requestStyle.descriptionWrapper}>
          <button
            onClick={() => {
              mode === "REQUEST" && onClose && onClose();
              mode !== "REQUEST" && onClickBack && onClickBack();
            }}
            className={requestStyle.iconButton}
          >
            {mode === "REQUEST" && (
              <CloseIcon size={24} color={vars.color.white} />
            )}
            {mode !== "REQUEST" && (
              <BackIcon size={24} color={vars.color.white} />
            )}
          </button>
          <h3
            className={requestStyle.description}
            style={{
              color: vars.color[descriptionColor],
            }}
          >
            {description}
          </h3>
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
            {onClickAPI && (
              <Button color="red" onClick={onClickAPI}>
                API
              </Button>
            )}
          </div>
        </div>
        <CodeBlock ref={ref} code={code} />
      </div>
    </div>
  );
};

export default forwardRef(ModalCodeBlock);
