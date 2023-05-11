import { style } from "@vanilla-extract/css";

export const searchStyle = {
  search: style({
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifySelf: "center",
    width: "80%",
    height: "40px",
    padding: "0 40px",
    marginTop: "20px",
  }),
  icon: style({
    position: "absolute",
    left: "12%",
    fontSize: "20px",
  }),
};
