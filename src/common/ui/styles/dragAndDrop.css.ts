import { style } from "@vanilla-extract/css";
import { vars } from "./theme.css";

export const dragAndDropStyles = {
  listViewStyle: style({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    width: "100%",
    boxSizing: "border-box",
  }),

  itemWrapper: style({
    boxSizing: "border-box",
    width: "100%",
  }),

  dragItemStyle: style({
    display: "flex",
  }),

  draggingStyle: style({
    backgroundColor: vars.color.darkGrey,
    zIndex: 1,
    width: "100%",
    boxSizing: "border-box",
  }),
};
