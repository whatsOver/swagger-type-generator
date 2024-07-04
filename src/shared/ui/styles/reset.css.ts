import { globalStyle } from "@vanilla-extract/css";

globalStyle("button", {
  border: "none",
  outline: "none",
  appearance: "none",
  background: "none",
  padding: 0,
  margin: 0,
  cursor: "pointer",
});

globalStyle("ul", {
  listStyle: "none",
  padding: 0,
  margin: 0,
});

globalStyle("li", {
  listStyle: "none",
  padding: 0,
  margin: 0,
});

globalStyle("input", {
  border: "none",
  outline: "none",
  padding: 0,
  margin: 0,
  background: "none",
  appearance: "none",
});

globalStyle("a", {
  textDecoration: "none",
  color: "inherit",
  cursor: "pointer",
});

globalStyle("h1, h2, h3, h4, h5, h6", {
  margin: 0,
  padding: 0,
  fontWeight: "normal",
});

globalStyle("p", {
  margin: 0,
  padding: 0,
});

globalStyle("img", {
  maxWidth: "100%",
  height: "auto",
  display: "block",
});

globalStyle("table", {
  borderCollapse: "collapse",
  borderSpacing: 0,
});

globalStyle("form", {
  margin: 0,
});

globalStyle("fieldset", {
  border: "none",
  margin: 0,
  padding: 0,
});

globalStyle("ol", {
  listStyle: "none",
  padding: 0,
  margin: 0,
});

globalStyle("textarea", {
  border: "none",
  outline: "none",
  padding: 0,
  margin: 0,
  appearance: "none",
  resize: "none",
});
