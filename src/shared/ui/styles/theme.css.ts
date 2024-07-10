import { createGlobalTheme } from "@vanilla-extract/css";

export type Color = keyof (typeof vars)["color"];

export const vars = createGlobalTheme(":root", {
  color: {
    background: "#16191C",
    scrollbar: "#2f3542",
    main: "#79EB3C",
    scrollbarTrack: "grey",
    scrollbarTrackBoxShadow: "inset 0px 0px 5px white",
    red: "#FF2A37",
    green: "#2EC885",
    lightGreen: "#79EB3C",
    royalBlue: "#30E1BA",
    blue: "#4CA5FD",
    orange: "#FF952D",
    yellow: "#F1D861",
    grey: "#323232",
    darkGrey: "#202020",
    lightGrey: "#4F4F4F",
    lightGrey2: "#8C8C8C",
    itemGrey: "#414141",
    white: "#FFFFFF",
    whiteOrange: "#FFEDDC",
    whiteRed: "#FFE9EA",
    whiteBlue: "#E7F0F9",
    purple: "#8B5AF2",
    darkPurple: "#5F3DC4",
    darkBlue: "#2F3542",
    darkGreen: "#1E824C",
    darkRed: "#A61B1B",
    darkOrange: "#833606",
  },
  methodColors: {
    get: "#4CA5FD",
    post: "#2EC885",
    put: "#FF952D",
    delete: "#FF2A37",
    patch: "#30E1BA",
  },
  methodBackgroundColors: {
    get: "#E7F0F9",
    post: "#E7F9F0",
    put: "#FFF9E7",
    delete: "#FFE7E7",
    patch: "#E7F9F0",
  },
});
