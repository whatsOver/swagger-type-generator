import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

const white = "#fff" as const;
const lightGray = {
  100: "#f8fafb",
  200: "#f4f7f9",
  300: "#ecf0f4",
  400: "#e5e9ee",
  500: "#dde1e8",
  600: "#d7dce4",
  700: "#ced4dc",
  800: "#c3c9d0",
  900: "#bdc3ca",
} as const;
const darkGray = {
  100: "#b2b8bf",
  200: "#a5abb2",
  300: "#989ea4",
  400: "#848a8f",
  500: "#606468",
  600: "#575a5e",
  700: "#4a4d50",
  800: "#3f4244",
  900: "#2b2d2f",
} as const;
const blue = {
  100: "#e6f5ff",
  200: "#c8e9ff",
  300: "#b7ddff",
  400: "#65b7ff",
  500: "#2f87f7",
  600: "#1e6eff",
  700: "#0f50f0",
  800: "#0a37d7",
  900: "#002887",
} as const;

const spacing = {
  "4": "4px",
  "8": "8px",
  "12": "12px",
  "16": "16px",
} as const;

const borderRadius = {
  "3": "3px",
} as const;

export const container = style({
  display: "flex",
  width: "100%",
  borderBottom: `1px solid ${lightGray[500]}`,
});

export const tabContainer = style({
  display: "flex",
  padding: "0 20px",
});

export const tabButton = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    height: "35px",
    fontSize: "14px",
    fontWeight: 400,
    width: "auto",
    marginRight: spacing["8"],
    marginBottom: "-1px !important",
    padding: `${spacing["8"]} ${spacing["16"]}`,
    textAlign: "center",
    cursor: "pointer",
    color: lightGray[100],
    backgroundColor: darkGray[200],
    borderRadius: `${borderRadius["3"]} ${borderRadius["3"]} 0 0`,
    borderLeft: `1px solid ${darkGray[200]}`,
    borderRight: `1px solid ${darkGray[200]}`,
    borderTop: `2px solid ${darkGray[200]}`,
    borderBottom: `1px solid ${darkGray[500]}`,
    transition: "background-color 0.3s, border-color 0.3s, color 0.3s",
    boxSizing: "border-box",

    selectors: {
      '&:hover:not(:disabled):not([aria-disabled="true"])': {
        color: blue[400],
        backgroundColor: lightGray[300],
      },
      '&:disabled, &[aria-disabled="true"]': {
        color: darkGray[100],
        backgroundColor: darkGray[200],
        borderLeftColor: darkGray[200],
        borderRightColor: darkGray[200],
        borderTopColor: darkGray[200],
        borderBottomColor: darkGray[500],
        cursor: "not-allowed",
      },
    },
  },
  variants: {
    state: {
      on: {
        color: blue[600],
        backgroundColor: white,
        borderLeftColor: lightGray[700],
        borderRightColor: lightGray[700],
        borderTopColor: blue[600],
        borderBottomColor: white,
        selectors: {
          "&:hover": {
            color: blue[600],
            backgroundColor: white,
            borderLeftColor: lightGray[700],
            borderRightColor: lightGray[700],
            borderTopColor: blue[600],
            borderBottomColor: white,
          },
        },
      },
    },
  },
});

export const subItemContents = style({
  width: "100%",
  height: "100%",
  padding: "0 20px",
});
