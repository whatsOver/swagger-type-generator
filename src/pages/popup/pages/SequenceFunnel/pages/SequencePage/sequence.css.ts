import { style } from "@vanilla-extract/css";

export const sequenceStyles = {
  headerButton: style({
    width: "5rem",
  }),
  sequenceWrapper: style({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    flex: 1,
    boxSizing: "border-box",
    height: "100%",
  }),
};
