import { style } from "@vanilla-extract/css";

export const loadingStyles = {
  wrapper: style({
    position: "fixed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 9999,
    top: 0,
    left: 0,
  }),
};
