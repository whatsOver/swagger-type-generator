import { style } from "@vanilla-extract/css";
import { vars } from "./theme.css";

export const headerStyle = {
  header: style({
    position: "sticky",
    display: "flex",
    top: 10,
    height: "50px",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
    zIndex: 1,
  }),
  left: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: "10px",
    width: "20%",
    cursor: "pointer",
  }),
};
