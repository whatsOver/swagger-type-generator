import { style } from "@vanilla-extract/css";
import { vars } from "./theme.css";

export const inputStyle = {
  input: style({
    appearance: "none",
    backgroundColor: vars.color.grey,
    border: "none",
    color: vars.color.white,
    borderRadius: "10px",
    height: "40px",
    width: "100%",
    padding: "0 10px",
    transition: "all 0.2s ease-in-out",
    ":focus": {
      outline: "none",
      backgroundColor: vars.color.lightGrey,
    },
    "::placeholder": {
      color: vars.color.lightGrey2,
    },
    // file css
    selectors: {
      "&[type='file']": {
        display: "none",
      },
    },
  }),
};
