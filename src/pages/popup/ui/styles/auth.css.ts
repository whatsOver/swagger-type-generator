import { vars } from "@src/common/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const authModalStyle = {
  modal: style({
    marginTop: "40px",
    backgroundColor: vars.color.darkGrey,
    color: vars.color.white,
    width: "300px",
    height: "200px",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  }),

  mainDescription: style({
    fontWeight: "bold",
    display: "flex",
    alignItems: "left",
    color: vars.color.orange,
  }),

  inputWrapper: style({
    marginTop: "20px",
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  }),

  inputDescription: style({
    width: "100px",
    textAlign: "start",
    color: vars.color.white,
  }),

  buttonWrapper: style({
    width: "100%",
    marginTop: "30px",
  }),
};
