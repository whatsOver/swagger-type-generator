import { style, keyframes, globalStyle } from "@vanilla-extract/css";

globalStyle("body.freeze", {
  overflow: "hidden",
});

export const modalStyle = {
  backdropStyle: style({
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }),

  fadeIn: keyframes({
    from: {
      opacity: 0,
    },

    to: {
      opacity: 1,
    },
  }),

  fadeOut: keyframes({
    from: {
      opacity: 1,
    },

    to: {
      opacity: 0,
    },
  }),

  modalStyle: style({
    position: "absolute",
    borderRadius: "20px",
    zIndex: 1000,
  }),

  showUp: keyframes({
    "0%": { opacity: 0, transform: "scale(0%)" },
    "100%": { opacity: 1, transform: "scale(100%)" },
  }),

  showOut: keyframes({
    "0%": { opacity: 1, transform: "scale(100%)" },
    "100%": { opacity: 0, transform: "scale(0%)" },
  }),
};
