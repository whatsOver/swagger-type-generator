import { style } from "@vanilla-extract/css";

export const dragApiStyles = {
  wrapper: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
    boxSizing: "border-box",
    padding: "0 1rem",
    columnGap: "1rem",
  }),
};
