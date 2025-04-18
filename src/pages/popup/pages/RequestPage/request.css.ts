import { vars } from "@/shared/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const requestStyles = {
  requestWrapper: style({
    width: "100%",
    boxSizing: "border-box",
    padding: "0 20px",
  }),

  body: style({
    display: "flex",
    flexDirection: "column",
    position: "relative",
    width: "100%",
    boxSizing: "border-box",
    height: "calc(100vh - 40px - 50px)",
    paddingTop: "1px",
    backgroundColor: vars.color.darkGrey,
    color: vars.color.white,
    borderRadius: "10px",
  }),

  apiItemContainer: style({
    display: "flex",
    width: "100%",
  }),

  requestBlock: style({
    overflowY: "auto",
    maxHeight: "70%",
    paddingRight: "0",
    padding: "20px",
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
      "&::-webkit-scrollbar-corner": {
        backgroundColor: vars.color.darkGrey,
      },
    },
  }),

  leftWrapper: style({
    display: "flex",
    columnGap: "10px",
    alignItems: "center",
  }),

  iconButton: style({
    display: "flex",
    alignItems: "center",
    flex: 1,
  }),

  flexView: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: "10px",
  }),

  modal: style({
    display: "flex",
    backgroundColor: vars.color.darkGrey,
    color: vars.color.white,
    borderRadius: "10px",
    padding: "20px",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 1,
    minWidth: 0,
    maxWidth: "80vw",
  }),

  descriptionWrapper: style({
    display: "flex",
    justifyContent: "space-between",
  }),

  endpoint: style({
    fontSize: "1rem",
    color: vars.color.white,
    marginTop: "20px",
    marginLeft: "20px",
    textAlign: "left",
  }),

  mainDescription: style({
    fontWeight: "bold",
    fontSize: "0.8rem",
    display: "flex",
    justifyContent: "left",
    textAlign: "left",
    color: vars.color.white,
    marginLeft: "20px",
    marginTop: "30px",
  }),

  description: style({
    fontWeight: "bold",
    display: "flex",
    textAlign: "left",
    color: vars.color.green,
    flex: 1,
  }),

  requestDescription: style({
    fontWeight: "bold",
    display: "flex",
    alignItems: "left",
    flex: 1,
    fontSize: "1.1rem",
    textAlign: "left",
  }),

  buttonWrapper: style({
    display: "flex",
    columnGap: "10px",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  }),

  type: style({
    color: vars.color.green,
    width: "100px",
    textAlign: "left",
  }),

  bodyType: style({
    color: vars.color.blue,
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
    justifyContent: "flex-end",
    boxSizing: "border-box",
    width: "calc(100% - 80px)",
    left: "40px",
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
};
