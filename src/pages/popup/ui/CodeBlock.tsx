import { useEffect, useRef } from "react";
import highlight from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { codeBlockStyle } from "./styles/codeBlock.css";
import classNames from "classnames";
import { forwardRef } from "react";
import { ForwardRefRenderFunction } from "react";

type CodeBlockProps = {
  code: string;
};

const CodeBlock: ForwardRefRenderFunction<HTMLDivElement, CodeBlockProps> = (
  { code },
  ref
) => {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      highlight.highlightBlock(codeRef.current);
    }
  }, [code]);

  return (
    <div ref={ref}>
      <pre className={codeBlockStyle.codeBlock}>
        <code
          ref={codeRef}
          className={classNames("typescript", codeBlockStyle.code)}
        >
          {code}
        </code>
      </pre>
    </div>
  );
};

export default forwardRef(CodeBlock);
