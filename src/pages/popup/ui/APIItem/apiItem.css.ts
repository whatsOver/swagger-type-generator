import { vars } from "@src/common/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const apiItemStyles = {
  button: style({
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

  flexRow: style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: "10px",
    width: "80%",
  }),

  path: style({
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontWeight: "bold",
  }),

  description: style({
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginTop: "5px",
    marginLeft: "3px",
  }),

  menuButton: style({
    width: "30px",
    height: "30px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    ":active": {
      opacity: 0.8,
    },
    transition: "opacity 0.3s ease",
  }),

  methodItem: style({
    display: "flex",
    padding: "7px",
    backgroundColor: vars.color.main,
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    fontSize: "12px",
  }),
};
