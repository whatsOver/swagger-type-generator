import { vars } from "@/shared/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const ApiListStyle = {
  ApiList: style({
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    listStyle: "none",
    margin: 0,
    padding: "0 1rem",
    border: 0,
  }),

  tag: style({
    width: "100%",
    display: "flex",
    color: vars.color.white,
    textAlign: "left",
    justifyContent: "flex-start",
    marginBottom: "1rem",
    paddingLeft: "2rem",
    fontWeight: "bold",
  }),

  tagBox: style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: vars.color.background,
    borderRadius: "10px",
    marginBottom: "10px",
    padding: "0 1rem",
    rowGap: "10px",
  }),
};
