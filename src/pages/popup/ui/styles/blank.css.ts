import { vars } from "@src/common/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const blankStyle = {
  content: style({
    width: "100%",
    height: "calc(100% - 120px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }),
  desorption: style({
    fontWeight: "bold",
    fontSize: "13px",
    marginTop: "10px",
    color: vars.color.white,
    whiteSpace: "pre-line",
    lineHeight: "1.5",
    textAlign: "left",
    width: "80%",
  }),
};
