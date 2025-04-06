import { style } from "@vanilla-extract/css";
import { vars } from "./theme.css";

export const headerStyle = {
  header: style({
    position: "sticky",
    display: "flex",
    top: "1px",
    height: "70px",
    padding: "20px",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
    zIndex: 1,
    backgroundColor: vars.color.background,
  }),
  left: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: "10px",
    boxSizing: "border-box",
    cursor: "pointer",
  }),
  right: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: "10px",
  }),
  headerTitle: style({
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: vars.color.white,
  }),
};
