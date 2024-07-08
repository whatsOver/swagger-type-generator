import { vars } from "@/shared/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const settingDrawerStyles = {
  list: style({
    display: "flex",
    justifyContent: "flex-start",
    justifyItems: "flex-start",
  }),
  listButton: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    borderBottom: `1px solid ${vars.color.lightGrey}`,
    padding: `1rem 1.5rem`,
    transition: "background-color 0.3s ease-in-out",
    selectors: {
      "&:hover": {
        backgroundColor: vars.color.lightGrey,
      },
      "&:nth-last-of-type(1)": {
        borderBottom: "none",
      },
    },
  }),
  itemText: style({
    fontSize: "1rem",
    fontWeight: "bold",
    color: vars.color.white,
  }),
};
