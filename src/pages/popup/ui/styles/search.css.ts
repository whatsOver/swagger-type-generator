import { style } from "@vanilla-extract/css";

export const searchStyle = {
  search: style({
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifySelf: "center",
    width: "80%",
    height: "40px",
    marginLeft: "10%",

    marginTop: "20px",
  }),
  icon: style({
    position: "absolute",
    left: "10px",
    fontSize: "20px",
  }),
};
