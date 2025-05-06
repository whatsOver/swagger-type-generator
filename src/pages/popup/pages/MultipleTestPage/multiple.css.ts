import { vars } from "@/shared/ui/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const multipleStyles = {
  headerRightButtonWrapper: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    columnGap: "1rem",
  }),

  multipleWrapper: style({
    display: "flex",
    width: "100%",
    boxSizing: "border-box",
    padding: "0 1rem",
    columnGap: "2rem",
    marginBottom: "5rem",
  }),

  ApiListWrapper: style({
    display: "flex",
    flex: 1,
    height: "fit-content",
    backgroundColor: vars.color.darkGrey,
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    borderRadius: "8px",
    padding: "1rem",
    boxSizing: "border-box",
    rowGap: "1rem",
  }),

  apiButton: style({
    width: "100%",
    border: `2px solid ${vars.color.darkGrey}`,
    borderRadius: "8px",
    color: vars.color.white,
    cursor: "pointer",
    boxSizing: "border-box",
  }),

  lineClamp: style({
    display: "-webkit-box",
    overflow: "hidden",
    wordBreak: "break-word",
    textOverflow: "ellipsis",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    textAlign: "left",
  }),

  buttonText: style({
    display: "-webkit-box",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    WebkitLineClamp: 3,
  }),

  // Request
  requestWrapper: style({
    display: "flex",
    flex: 4,
    minHeight: "70dvh",
    height: "fit-content",
    maxHeight: "fit-content",
    backgroundColor: vars.color.darkGrey,
    color: vars.color.white,
    borderRadius: "10px",
    flexDirection: "column",
    minWidth: 0,
    boxSizing: "border-box",
  }),

  mainDescription: style({
    fontWeight: "bold",
    display: "flex",
    textAlign: "left",
    color: vars.color.white,
    marginLeft: "20px",
    marginRight: "20px",
    marginTop: "30px",
  }),

  subDescription: style({
    fontWeight: "bold",
    display: "flex",
    textAlign: "left",
    color: vars.color.white,
    marginLeft: "20px",
  }),

  requestBlock: style({
    overflowY: "auto",
    maxHeight: "70%",
    paddingRight: "0",
    padding: "20px",
    selectors: {
      "&::-webkit-scrollbar": {
        width: "10px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: vars.color.scrollbar,
        borderRadius: "10px",
        backgroundClip: "padding-box",
        border: "2px solid transparent",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: vars.color.scrollbarTrack,
        borderRadius: "10px",
        boxShadow: vars.color.scrollbarTrackBoxShadow,
      },
      "&::-webkit-scrollbar-corner": {
        backgroundColor: vars.color.darkGrey,
      },
    },
  }),

  flexView: style({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: "10px",
  }),

  description: style({
    fontWeight: "bold",
    display: "flex",
    alignItems: "left",
    color: vars.color.green,
    flex: 1,
  }),

  fixedButtonWrapper: style({
    position: "absolute",
    bottom: "40px",
    width: "90%",
    display: "flex",
  }),
};
