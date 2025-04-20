import { recipe } from "@vanilla-extract/recipes";
import { vars } from "../styles/theme.css";

export const mainTab = recipe({
  base: {
    display: "flex",
    borderRadius: 0,
    borderStyle: "solid",
    borderColor: "#dde1e8",
    borderWidth: 0,
    borderBottomWidth: "1px",
    width: "100%",
    padding: "0 20px",
    boxSizing: "border-box",
    position: "sticky",
    top: "70px",
    zIndex: 1,
    backgroundColor: vars.color.background,
  },

  variants: {
    position: {
      top: {
        borderBottomWidth: 0,
        borderTopWidth: "1px",
      },
      bottom: {
        borderBottomWidth: "1px",
      },
    },
  },
});
