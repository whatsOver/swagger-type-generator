import { vars } from "@/shared/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const itemBase = style({
  display: "flex",
  flexDirection: "row",
  columnGap: "20px",
  padding: "12px 20px",
  alignItems: "center",
  borderBottom: `1px solid ${vars.color.blue}`,
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.darkGrey,
    },
    "&:last-child": {
      borderBottom: "none",
    },
  },
});

export const roundBall = style({
  width: "15px",
  height: "15px",
  borderRadius: "50%",
  backgroundColor: vars.color.white,
});

export const contentContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

export const itemSelected = style({
  backgroundColor: vars.color.darkGrey,
});

export const titleStyle = style({
  fontSize: "16px",
  fontWeight: "bold",
  color: vars.color.white,
  marginBottom: "4px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  textAlign: "left",
});

export const descriptionSnippetStyle = style({
  fontSize: "13px",
  color: vars.color.lightGrey2,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineHeight: "1.4",
  textAlign: "left",
});
