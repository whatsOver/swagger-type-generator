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
    blue: "#4CA5FD",
    orange: "#FF952D",
    grey: "#323232",
    darkGrey: "#202020",
    lightGrey: "#4F4F4F",
    lightGrey2: "#8C8C8C",
    white: "#FFFFFF",
    whiteOrange: "#FFEDDC",
    whiteRed: "#FFE9EA",
    whiteBlue: "#E7F0F9",
    purple: "#8B5AF2",
    darkPurple: "#5F3DC4",
    darkBlue: "#2F3542",
  },
  methodColors: {
    GET: "#4CA5FD",
    POST: "#2EC885",
    PUT: "#FF952D",
    DELETE: "#FF2A37",
  },
  methodBackgroundColors: {
    GET: "#E7F0F9",
    POST: "#E7F9F0",
    PUT: "#FFF9E7",
    DELETE: "#FFE7E7",
  },
});
