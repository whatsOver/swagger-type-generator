import { style } from "@vanilla-extract/css";
import { vars } from "./theme.css";

export const drawerStyles = {
  container: style({
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "80vw",
    backgroundColor: vars.color.darkGrey,
    boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    zIndex: 3,
    transition: "transform 0.3s ease-in-out",
  }),
  containerOpen: style({
    transform: "translateX(0)",
  }),
  containerClose: style({
    transform: "translateX(-100%)",
  }),

  overlayBase: style({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 2,
    cursor: "pointer",
    transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out",
  }),
  overlayOpen: style({
    opacity: 1,
    visibility: "visible",
  }),
  overlayClose: style({
    opacity: 0,
    visibility: "hidden",
  }),

  closeButton: style({
    display: "flex",
    justifyContent: "flex-end",
    padding: "1rem",
    cursor: "pointer",
  }),
};
