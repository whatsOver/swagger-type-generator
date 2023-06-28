import { vars } from "@src/common/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

const codeBlockStyle = {
  code: style({
    height: "calc(70vh - 40px - 70px)",
    backgroundColor: "#16191C",
    borderRadius: "10px",
    selectors: {
      "&::-webkit-scrollbar": {
        width: "10px",
        height: "10px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: vars.color.scrollbar,
        borderRadius: "10px",
        backgroundClip: "padding-box",
        border: "2px solid transparent",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: vars.color.scrollbarTrack,
        borderRadius: "10px",
        boxShadow: vars.color.scrollbarTrackBoxShadow,
      },
      "&::-webkit-scrollbar-corner": {
        backgroundColor: "#16191C",
      },
    },
  }),
  codeBlock: style({
    whiteSpace: "pre-wrap",
    textAlign: "left",
  }),
};

export { codeBlockStyle };
