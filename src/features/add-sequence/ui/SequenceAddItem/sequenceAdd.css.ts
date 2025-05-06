import { vars } from "@/shared/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const sequenceAddItemStyles = {
  wrapper: style({
    display: "flex",
    alignItems: "center",
    height: "80px",
    padding: "0.625rem 1.25rem",
    backgroundColor: vars.color.grey,
    marginBottom: "1rem",
    columnGap: "1rem",
    overflow: "hidden",
    boxSizing: "border-box",
  }),

  left: style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "3rem",
  }),

  right: style({
    display: "flex",
    flexDirection: "column",
    alignContent: "flex-start",
    columnGap: "0.5rem",
    width: "100%",
    overflow: "hidden",
  }),

  input: style({
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none",
    backgroundColor: vars.color.itemGrey,
    color: vars.color.white,
    fontSize: "1rem",
    fontWeight: "bold",
    boxSizing: "border-box",
    borderRadius: "5px",
    padding: "0.5rem",
    selectors: {
      "&::placeholder": {
        color: vars.color.lightGrey,
      },
    },
  }),

  iconsWrapper: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    columnGap: "0.5rem",
  }),

  checkIcon: style({
    cursor: "pointer",
  }),

  closeIcon: style({
    cursor: "pointer",
  }),
};
