import { style } from "@vanilla-extract/css";

export const headerStyle = {
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
