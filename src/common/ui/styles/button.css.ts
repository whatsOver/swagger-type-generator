import { style } from "@vanilla-extract/css";
import { vars } from "./theme.css";

export const buttonStyles = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "0 solid transparent",
  borderRadius: "10px",
  whiteSpace: "nowrap",
  userSelect: "none",
  width: "100%",
  minHeight: "40px",
  height: "40px",
  fontSize: "13px",
  WebkitFontSmoothing: "antialiased",
  transition: "color 0.3s ease-in-out, background-color 0.3s ease-in-out",
  backgroundColor: vars.color.purple,
  color: vars.color.white,
  selectors: {
    "&:focus": {
      outline: "none",
    },
    "&:disabled": {
      cursor: "not-allowed",
      backgroundColor: vars.color.lightGrey,
    },
    "&:active": {
      backgroundColor: vars.color.darkPurple,
    },
  },
});

export const blueButtonStyles = style({
  width: "50px",
  backgroundColor: vars.color.blue,
  selectors: {
    "&:active": {
      backgroundColor: vars.color.darkBlue,
    },
  },
});
