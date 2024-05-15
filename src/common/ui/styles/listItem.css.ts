import { style } from "@vanilla-extract/css";
import { vars } from "./theme.css";

export const listItemStyles = {
  itemWrapper: style({
    display: "flex",
    width: "100%",
    height: "100%",
    alignItems: "center",
    transition: "background-color 0.2s ease-in-out",
    selectors: {
      "&:active": {
        backgroundColor: vars.color.darkGrey,
      },
    },
    boxSizing: "border-box",
    columnGap: "1rem",
  }),

  leftWrapper: style({
    display: "flex",
    columnGap: "1rem",
    height: "100%",
    width: "100%",
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
  }),

  rightWrapper: style({
    marginLeft: "auto",
  }),
};
