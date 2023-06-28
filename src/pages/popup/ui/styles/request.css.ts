import { vars } from "@src/common/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const requestStyle = {
  body: style({
    marginTop: "20px",
    width: "90%",
    height: "calc(100vh - 40px - 70px)",
    backgroundColor: vars.color.darkGrey,
    color: vars.color.white,
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
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
    marginTop: "40px",
    backgroundColor: vars.color.darkGrey,
    color: vars.color.white,
    width: "70vw",
    height: "70vh",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }),

  descriptionWrapper: style({
    display: "flex",
    justifyContent: "space-between",
  }),

  mainDescription: style({
    fontWeight: "bold",
    display: "flex",
    alignItems: "left",
    color: vars.color.white,
    marginLeft: "20px",
    marginTop: "30px",
  }),

  description: style({
    fontWeight: "bold",
    display: "flex",
    alignItems: "left",
    color: vars.color.green,
    flex: 1,
  }),

  requestDescription: style({
    fontWeight: "bold",
    display: "flex",
    alignItems: "left",
    flex: 1,
    fontSize: "1.1rem",
    justifyContent: "left",
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

  inputBox: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: "10px",
    marginBottom: "10px",
  }),

  label: style({
    width: "100px",
    textAlign: "left",
    overflow: "hidden",
    wordBreak: "break-all",
    lineClamp: 2,
  }),

  fixedButtonWrapper: style({
    position: "absolute",
    bottom: "40px",
    width: "90%",
    display: "flex",
  }),

  response: style({
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    color: vars.color.green,
    marginTop: "10px",
    width: "100%",
    height: "100%",
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
