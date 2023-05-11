import { style } from "@vanilla-extract/css";
import { vars } from "./theme.css";

export const popupStyle = {
  app: style({
    position: "absolute",
    backgroundColor: vars.color.backgroundColor,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "center",
    overflowY: "scroll",
    overflowX: "hidden",
    selectors: {
      "&::-webkit-scrollbar": {
        width: "10px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: vars.color.scrollbarColor,
        borderRadius: "10px",
        backgroundClip: "padding-box",
        border: "2px solid transparent",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: vars.color.scrollbarTrackColor,
        borderRadius: "10px",
        boxShadow: vars.color.scrollbarTrackBoxShadow,
      },
    },
  }),

  tag: style({
    width: "100%",
    marginLeft: "20%",
    display: "flex",
    color: "white",
    textAlign: "left",
    justifyContent: "flex-start",
  }),

  apiList: style({
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    listStyle: "none",
    margin: 0,
    padding: 0,
    border: 0,
  }),

  tagBox: style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    backgroundColor: vars.color.backgroundColor,
    borderRadius: "10px",
    marginBottom: "10px",
  }),

  button: style({
    overflow: "hidden",
    margin: 0,
    border: "none",
    color: "inherit",
    outline: "none",
    appearance: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    width: "80%",
    marginBottom: "10px",
    ":hover": {
      backgroundColor: vars.color.backgroundColor,
      opacity: 0.8,
    },
    transition: "opacity 0.3s ease",
  }),

  methodItem: style({
    display: "flex",
    padding: "10px",
    backgroundColor: vars.color.mainColor,
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
  }),

  flexRow: style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: "10px",
    width: "80%",
  }),

  path: style({
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontWeight: "bold",
  }),

  description: style({
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginTop: "5px",
    marginLeft: "3px",
  }),
};
