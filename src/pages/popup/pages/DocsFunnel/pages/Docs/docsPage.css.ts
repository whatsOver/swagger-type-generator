import { style } from "@vanilla-extract/css";

export const docsPageStyles = {
  docsWrapper: style({
    display: "flex",
    width: "100%",
    flexDirection: "column",
    padding: "0 0 15px 0px",
    boxSizing: "border-box",
    gap: "15px",
    height: "100%",
    flex: 1,
  }),
  blankItemWrapper: style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    flex: 1,
    padding: "0 20px 0px 20px",
  }),
};
