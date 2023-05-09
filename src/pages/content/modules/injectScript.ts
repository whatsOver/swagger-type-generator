const injectScript = (file: string, node: HTMLElement): void => {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file);
  node.appendChild(script);
};

export default injectScript;
