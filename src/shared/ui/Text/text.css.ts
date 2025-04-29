import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

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
  400: "#848a8f", // secondary
  500: "#606468", // primary (예시)
  600: "#575a5e",
  700: "#4a4d50",
  800: "#3f4244",
  900: "#2b2d2f", // default (예시)
} as const;
const blue = {
  100: "#e6f5ff",
  200: "#c8e9ff",
  300: "#b7ddff",
  400: "#65b7ff",
  500: "#2f87f7",
  600: "#1e6eff", // accent
  700: "#0f50f0",
  800: "#0a37d7",
  900: "#002887",
} as const;

const fontSizes = {
  300: "12px",
  400: "14px",
  500: "16px",
  600: "18px",
} as const;

const fontWeights = {
  regular: 400,
  medium: 500,
  bold: 700,
} as const;

export const text = recipe({
  base: {
    margin: 0,
    padding: 0,
    lineHeight: 1.5,
    color: darkGray[900],
    fontSize: fontSizes[400],
    fontWeight: fontWeights.regular,
  },

  variants: {
    color: {
      primary: { color: darkGray[500] },
      secondary: { color: darkGray[400] },
      accent: { color: blue[600] },
      white: { color: white },
    },
    size: {
      300: { fontSize: fontSizes[300] },
      400: { fontSize: fontSizes[400] },
      500: { fontSize: fontSizes[500] },
      600: { fontSize: fontSizes[600] },
    },
    weight: {
      regular: { fontWeight: fontWeights.regular },
      medium: { fontWeight: fontWeights.medium },
      bold: { fontWeight: fontWeights.bold },
    },
  },

  defaultVariants: {
    size: 400,
    weight: "regular",
  },
});

export type TextVariants = RecipeVariants<typeof text>;
