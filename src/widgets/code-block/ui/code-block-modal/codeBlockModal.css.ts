import { vars } from "@/shared/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const codeBlockModalStyles = {
  modal: style({
    display: "flex",
    backgroundColor: vars.color.darkGrey,
    color: vars.color.white,
    borderRadius: "10px",
    padding: "20px",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 1,
    minWidth: 0,
    maxWidth: "80vw",
  }),

  response: style({
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    color: vars.color.green,
    marginTop: "10px",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
  }),

  iconButton: style({
    display: "flex",
    alignItems: "center",
    flex: 1,
  }),

  requestDescription: style({
    fontWeight: "bold",
    display: "flex",
    alignItems: "left",
    flex: 1,
    fontSize: "1.1rem",
    textAlign: "left",
  }),

  buttonWrapper: style({
    display: "flex",
    columnGap: "10px",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  }),

  descriptionWrapper: style({
    display: "flex",
    justifyContent: "space-between",
  }),

  leftWrapper: style({
    display: "flex",
    columnGap: "10px",
    alignItems: "center",
  }),
};
