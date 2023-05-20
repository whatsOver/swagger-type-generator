import { requestStyle } from "./styles/request.css";
import Button from "@src/common/ui/Button";
import CodeBlock from "./CodeBlock";
import { vars } from "@src/common/ui/styles/theme.css";
import { ForwardRefRenderFunction } from "react";
import { forwardRef } from "react";

interface ModalCodeBlockProps {
  description: string;
  descriptionColor?: keyof typeof vars.color;
  code: string;
  onClickTS?: () => void;
  onClickCopy?: () => void;
}

const ModalCodeBlock: ForwardRefRenderFunction<
  HTMLDivElement,
  ModalCodeBlockProps
> = (
  {
    description = vars.color.green,
    descriptionColor,
    code,
    onClickTS,
    onClickCopy,
  },
  ref
) => {
  return (
    <div className={requestStyle.modal}>
      <div className={requestStyle.response}>
        <div className={requestStyle.descriptionWrapper}>
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
          </div>
        </div>
        <CodeBlock ref={ref} code={code} />
      </div>
    </div>
  );
};

export default forwardRef(ModalCodeBlock);
