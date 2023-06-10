import { vars } from "@src/common/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const popupStyle = {
  app: style({
    position: "absolute",
    backgroundColor: vars.color.background,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    width: "500px",
    height: "600px",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "center",
    overflowX: "hidden",
    overflowY: "auto",
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

  header: style({
    width: "500px",
    height: "100%",
  }),

  settingWrapper: style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyItems: "flex-end",
    justifyContent: "flex-end",
    padding: "10px 20px",
    columnGap: "20px",
  }),

  tag: style({
    width: "100%",
    marginLeft: "20%",
    display: "flex",
    color: vars.color.white,
    textAlign: "left",
    justifyContent: "flex-start",
    transition: "color 0.2s ease",
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
    backgroundColor: vars.color.background,
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
    padding: "3px ",
    borderRadius: "10px",
    cursor: "pointer",
    width: "80%",
    marginBottom: "10px",
    ":hover": {
      opacity: 0.8,
    },
    transition: "opacity 0.3s ease",
  }),

  methodItem: style({
    display: "flex",
    padding: "7px",
    backgroundColor: vars.color.main,
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    fontSize: "12px",
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
