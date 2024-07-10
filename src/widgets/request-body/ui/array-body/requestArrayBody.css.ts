import { vars } from "@/shared/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const requestArrayBodyStyles = {
  type: style({
    color: vars.color.green,
    width: "100px",
    textAlign: "left",
  }),

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

  inputLabel: style({
    textAlign: "left",
    overflow: "hidden",
    wordBreak: "break-all",
    lineClamp: 2,
  }),

  uploadButton: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "5rem",
    height: "2.5rem",
    borderRadius: "10px",
    backgroundColor: vars.color.blue,
    color: vars.color.white,
    cursor: "pointer",
    selectors: {
      "&:active": {
        backgroundColor: vars.color.darkBlue,
      },
    },
  }),

  label: style({
    width: "100px",
    textAlign: "left",
    overflow: "hidden",
    wordBreak: "break-all",
    lineClamp: 2,
  }),

  rightWrapper: style({
    display: "flex",
    columnGap: "10px",
  }),

  plusButton: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "3rem",
    height: "2.5rem",
    borderRadius: "10px",
    backgroundColor: vars.color.purple,
    color: vars.color.white,
    cursor: "pointer",
    selectors: {
      "&:active": {
        backgroundColor: vars.color.darkPurple,
      },
    },
  }),

  arrayBoxWrapper: style({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "left",
    columnGap: "10px",
    rowGap: "10px",
    marginTop: "10px",
    marginBottom: "10px",
    padding: "1rem",
    borderRadius: "10px",
    backgroundColor: vars.color.darkBlue,
    minHeight: "1.5rem",
  }),

  arrayGreenBox: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 10px",
    height: "1rem",
    borderRadius: "5px",
    backgroundColor: vars.color.green,
    cursor: "pointer",
    selectors: {
      "&:active": {
        backgroundColor: vars.color.darkGreen,
      },
    },
  }),

  arrayBlueBox: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 10px",
    height: "1rem",
    borderRadius: "5px",
    backgroundColor: vars.color.blue,
    cursor: "pointer",
    selectors: {
      "&:active": {
        backgroundColor: vars.color.darkBlue,
      },
    },
  }),

  fixedButtonWrapper: style({
    display: "flex",
    position: "fixed",
    bottom: "40px",
    width: "100%",
    paddingRight: "2rem",
    boxSizing: "border-box",
  }),

  response: style({
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    color: vars.color.green,
    marginTop: "10px",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
  }),

  responseBody: style({
    display: "flex",
    flexDirection: "column",
    width: "90%",
    maxHeight: "80%",
    textAlign: "left",
    alignItems: "left",
    color: vars.color.white,
    overflowY: "scroll",
    selectors: {
      "&::-webkit-scrollbar": {
        width: "10px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: vars.color.scrollbar,
        borderRadius: "10px",
        backgroundClip: "padding-box",
        border: "2px solid transparent",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: vars.color.scrollbarTrack,
        borderRadius: "10px",
        boxShadow: vars.color.scrollbarTrackBoxShadow,
      },
    },
  }),
};
