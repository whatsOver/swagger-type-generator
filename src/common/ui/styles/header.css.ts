import { style } from "@vanilla-extract/css";

export const headerStyle = {
  header: style({
    position: "sticky",
    display: "flex",
    top: "1rem",
    height: "50px",
    padding: "1rem",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
    zIndex: 1,
  }),
  left: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: "10px",

    cursor: "pointer",
  }),
  right: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: "10px",
  }),
};
