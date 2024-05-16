import { vars } from "@src/common/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const sequenceItemStyles = {
  wrapper: style({
    overflow: "hidden",
    margin: 0,
    border: "none",
    color: "inherit",
    outline: "none",
    appearance: "none",
    display: "flex",
    padding: "3px ",
    borderRadius: "10px",
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box",
    ":active": {
      opacity: 0.8,
    },
    transition: "opacity 0.3s ease",
  }),

  right: style({
    overflow: "hidden",
    margin: 0,
    border: "none",
    color: "inherit",
    outline: "none",
    appearance: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "3px ",
    borderRadius: "10px",
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box",
    ":active": {
      opacity: 0.8,
    },
    transition: "opacity 0.3s ease",
  }),

  title: style({
    fontSize: "1rem",
    fontWeight: "bold",
    color: vars.color.white,
    marginBottom: "0.5rem",
    textAlign: "left",
  }),

  sequenceList: style({
    display: "flex",
    columnGap: "0.5rem",
  }),

  blankItem: style({
    display: "flex",
    padding: "4px 6px",
    backgroundColor: vars.color.darkBlue,
    borderRadius: "5px",
    color: "white",
    fontWeight: "bold",
    fontSize: "12px",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "5rem",
  }),

  methodItem: style({
    display: "flex",
    padding: "4px 6px",
    backgroundColor: vars.color.main,
    borderRadius: "5px",
    color: "white",
    fontWeight: "bold",
    fontSize: "12px",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "5rem",
  }),

  description: style({
    fontSize: "0.75rem",
    color: vars.color.white,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textAlign: "center",
  }),
};
