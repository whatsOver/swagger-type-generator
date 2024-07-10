import { vars } from "@/shared/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const requestBodyStyles = {
  description: style({
    fontWeight: "bold",
    display: "flex",
    textAlign: "left",
    color: vars.color.green,
    flex: 1,
  }),
};
