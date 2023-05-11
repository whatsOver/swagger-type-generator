import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "GET_SWAGGER_LIST") {
    sendResponse({ received: true });
    return true;
  }
  if (request.message === "READY") {
    sendResponse({ received: true });
    return true;
  }
  return true;
});
