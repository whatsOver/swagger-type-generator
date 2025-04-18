import { vars } from "@/shared/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const listContainerStyle = style({
  overflowY: "auto",
  flexGrow: 1,
  borderTop: `1px solid ${vars.color.darkGrey}`,
});

export const emptyListStyle = style({
  padding: "20px",
  textAlign: "center",
  color: vars.color.lightGrey,
});
