import { style } from "@vanilla-extract/css";

export const headerStyle = {
  header: style({
    position: "sticky",
    display: "flex",
    top: 10,
    height: "50px",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
  }),
  left: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: "10px",
    width: "20%",
    cursor: "pointer",
    marginLeft: "30px",
  }),
};
