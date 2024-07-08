import { vars } from "@/shared/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const requestNormalParamStyles = {
  inputWrapper: style({
    display: "flex",
    flexDirection: "column",
  }),

  inputBox: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: "10px",
    marginBottom: "10px",
  }),

  type: style({
    color: vars.color.green,
    width: "100px",
    textAlign: "left",
  }),

  label: style({
    width: "100px",
    textAlign: "left",
    overflow: "hidden",
    wordBreak: "break-all",
    lineClamp: 2,
  }),
};
