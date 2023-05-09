import { createGlobalTheme } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
  color: {
    backgroundColor: "#2C3333",
    scrollbarColor: "#2f3542",
    mainColor: "#79EB3C",
    scrollbarTrackColor: "grey",
    scrollbarTrackBoxShadow: "inset 0px 0px 5px white",
    redColor: "#FF2A37",
    greenColor: "#2EC885",
    blueColor: "#4CA5FD",
    orangeColor: "#FF952D",
    whiteOrangeColor: "#FFEDDC",
    whiteRedColor: "#FFE9EA",
    whiteBlueColor: "#E7F0F9",
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
