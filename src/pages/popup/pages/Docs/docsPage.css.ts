import { style } from "@vanilla-extract/css";

export const docsPageStyles = {
  docsWrapper: style({
    display: "flex",
    width: "100%",
    flexDirection: "column",
    padding: "0 0 15px 0",
    boxSizing: "border-box",
    gap: "15px",
  }),
};
