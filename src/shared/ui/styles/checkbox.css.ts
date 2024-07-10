import { style } from "@vanilla-extract/css";

export const checkboxStyles = {
  labelStyle: style({
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    columnGap: "1rem",
  }),
  iconWrapper: style({}),
  inputStyle: style({
    display: "none",
  }),
};
