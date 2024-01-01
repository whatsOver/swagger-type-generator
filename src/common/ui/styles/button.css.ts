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
  width: "40px",
  height: "30px",
  fontSize: "11px",
  fontWeight: "bold",
  backgroundColor: vars.color.blue,
  selectors: {
    "&:active": {
      backgroundColor: vars.color.darkBlue,
    },
  },
});

export const greenButtonStyles = style({
  width: "40px",
  height: "30px",
  fontSize: "11px",
  fontWeight: "bold",
  backgroundColor: vars.color.green,
  selectors: {
    "&:active": {
      backgroundColor: vars.color.darkGreen,
    },
  },
});

export const redButtonStyles = style({
  width: "40px",
  height: "30px",
  fontSize: "11px",
  fontWeight: "bold",
  backgroundColor: vars.color.red,
  selectors: {
    "&:active": {
      backgroundColor: vars.color.darkRed,
    },
  },
});

export const orangeButtonStyles = style({
  width: "40px",
  height: "30px",
  fontSize: "11px",
  fontWeight: "bold",
  backgroundColor: vars.color.orange,
  selectors: {
    "&:active": {
      backgroundColor: vars.color.darkOrange,
    },
  },
});

export const purpleButtonStyles = style({
  width: "40px",
  height: "30px",
  fontSize: "11px",
  fontWeight: "bold",
  backgroundColor: vars.color.purple,
  selectors: {
    "&:active": {
      backgroundColor: vars.color.darkPurple,
    },
  },
});
