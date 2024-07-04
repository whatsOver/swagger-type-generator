import { vars } from "@/shared/ui/styles/theme.css";
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
    width: "100vw",
    height: "100vh",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "center",
    overflowX: "hidden",
    overflowY: "auto",
    boxSizing: "border-box",
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
    width: "100%",
  }),

  searchWrapper: style({
    width: "100%",
    padding: "0 1rem",
    boxSizing: "border-box",
    marginBottom: "1rem",
  }),

  settingWrapper: style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    columnGap: "20px",
  }),

  settingButtonWrapper: style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: "10px",
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

  menuButton: style({
    width: "30px",
    height: "30px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    ":hover": {
      opacity: 0.8,
    },
    transition: "opacity 0.3s ease",
  }),
};
