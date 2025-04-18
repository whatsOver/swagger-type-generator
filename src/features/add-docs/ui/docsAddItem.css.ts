import { vars } from "@/shared/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const addItemStyles = {
  container: style({
    display: "flex",
    flexDirection: "column", // Stack inputs vertically
    gap: "10px",
    width: "100%",
    padding: "35px 25px 15px 25px",
    backgroundColor: vars.color.grey, // Use a theme background color
    borderRadius: "8px",
    position: "relative", // For positioning the close button
    border: `1px solid ${vars.color.darkGrey}`,
    boxSizing: "border-box",
  }),
  input: style({
    padding: "10px",
    border: `1px solid ${vars.color.darkGrey}`,
    borderRadius: "4px",
    backgroundColor: vars.color.darkGrey, // Use darkGrey for input background
    color: vars.color.white,
    fontSize: "14px",
    width: "100%", // Ensure full width within container padding
    boxSizing: "border-box", // Include padding and border in width
    selectors: {
      "&:focus": {
        outline: "none",
        borderColor: vars.color.purple, // Use purple as primary focus color
      },
    },
  }),
  textarea: style({
    padding: "10px",
    border: `1px solid ${vars.color.darkGrey}`,
    borderRadius: "4px",
    backgroundColor: vars.color.darkGrey, // Use darkGrey for textarea background
    color: vars.color.white,
    fontSize: "14px",
    resize: "none",
    minHeight: "60px",
    fontFamily: "inherit", // Ensure consistent font
    width: "100%", // Ensure full width
    boxSizing: "border-box",

    selectors: {
      "&:focus": {
        outline: "none",
        borderColor: vars.color.purple, // Use purple as primary focus color
      },
      "&::-webkit-scrollbar": {
        display: "none",
      },
      "&::-webkit-scrollbar-thumb": {
        display: "none",
      },
      "&::-webkit-scrollbar-track": {
        display: "none",
      },
    },
  }),
  closeButton: style({
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: vars.color.lightGrey,
    ":hover": {
      color: vars.color.white,
    },
  }),
  colorList: style({
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  }),
  colorItem: style({
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: vars.color.white,
    boxSizing: "border-box",
  }),
};
