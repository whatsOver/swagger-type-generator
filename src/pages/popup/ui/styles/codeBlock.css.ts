import { style } from "@vanilla-extract/css";

const codeBlockStyle = {
  code: style({
    width: "300px",
    height: "300px",
    backgroundColor: "#16191C",
    borderRadius: "10px",
  }),
  codeBlock: style({
    whiteSpace: "pre-wrap",
    textAlign: "left",
  }),
};

export { codeBlockStyle };
