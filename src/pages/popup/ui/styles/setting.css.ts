import { vars } from "@src/common/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const settingModalStyle = {
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

  logoImg: style({
    width: "30px",
    height: "30px",
    borderRadius: "10px",
  }),

  imgAndIconWrapper: style({
    display: "flex",
    alignItems: "center",
    columnGap: "10px",
  }),

  checkboxStyle: style({
    display: "block",
    width: "20px",
    height: "20px",
    marginRight: "10px",
    borderRadius: "5px",
    border: "1px solid white",
    appearance: "none", // Reset to default style
    backgroundColor: "transparent", // You can set this to whatever you want
    transition: "background-color 0.3s ease-out",
    ":before": {
      content: "''",
      display: "inline-block",
      width: "20px",
      height: "20px",
      borderRadius: "5px",
    },
    ":checked": {
      backgroundColor: "orange",
    },
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
