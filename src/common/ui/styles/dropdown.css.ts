import { style, keyframes } from "@vanilla-extract/css";
import { vars } from "./theme.css";

const showUp = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

const showOut = keyframes({
  "0%": { opacity: 1 },
  "100%": { opacity: 0 },
});

export const dropDownStyles = {
  modalWrapperStyle: style({
    position: "fixed",
    display: "flex",
    backgroundColor: vars.color.lightGrey,
    width: "240px",
    flexDirection: "column",
    padding: "12px 0",
    borderRadius: "8px",
    zIndex: 1000,
  }),
  listButtonStyle: style({
    display: "flex",
    alignItems: "center",
    width: "100%",
    borderBottom: `1px solid ${vars.color.lightGrey2}`,
    backgroundColor: vars.color.lightGrey,
    padding: "12px 20px",
    ":hover": {
      backgroundColor: vars.color.darkGrey,
    },
    selectors: {
      "&:nth-last-of-type(1)": {
        borderBottom: "none",
      },
    },
    transition: "all 0.2s ease-in-out",
    color: vars.color.white,
  }),
  showAnimation: style({
    animation: `${showUp} 0.2s ease-in-out`,
    display: "flex",
  }),
  hideAnimation: style({
    animation: `${showOut} 0.2s ease-in-out`,
    display: "none",
  }),
};
