import { style } from "@vanilla-extract/css";

export const searchStyles = {
  search: style({
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifySelf: "center",
    width: "100%",
    height: "40px",
    marginTop: "20px",
  }),
  icon: style({
    position: "absolute",
    left: "10px",
    fontSize: "20px",
  }),
};
