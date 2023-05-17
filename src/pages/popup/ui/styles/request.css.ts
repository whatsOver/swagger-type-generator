import { vars } from "@src/common/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const requestStyle = {
  body: style({
    marginTop: "50px",
    width: "385px",
    backgroundColor: vars.color.darkGrey,
    color: vars.color.white,
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
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

  modal: style({
    marginTop: "40px",
    backgroundColor: vars.color.darkGrey,
    color: vars.color.white,

    height: "300px",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  }),

  description: style({
    fontWeight: "bold",
    display: "flex",
    alignItems: "left",
    color: vars.color.green,
  }),

  type: style({
    color: vars.color.green,
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
  }),

  buttonWrapper: style({
    position: "absolute",
    bottom: "20px",
    width: "85%",
    display: "flex",
    marginLeft: "-20px",
    marginTop: "10px",
  }),

  response: style({
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    color: vars.color.green,
    marginTop: "10px",
  }),

  responseBody: style({
    display: "flex",
    flexDirection: "column",
    width: "300px",
    maxHeight: "200px",
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
