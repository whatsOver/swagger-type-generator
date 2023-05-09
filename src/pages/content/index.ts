import injectScript from "./modules/injectScript";

injectScript(chrome.runtime.getURL("getAPIList.js"), document.documentElement);

const getAPIListFromPage = async (): Promise<
  Array<{ title: string; issueNumber: string }>
> => {
  return new Promise((resolve) => {
    window.postMessage({ type: "GET_API_LIST" }, window.location.origin);
    window.addEventListener("message", (event) => {
      if (
        event.source === window &&
        event.data.type === "GET_API_LIST_RESULT"
      ) {
        resolve(event.data.prList);
      }
    });
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "READY") {
    sendResponse({ code: 200, data: true });
    return true;
  }
  if (request.message === "GET_SWAGGER_LIST") {
    (async () => {
      const prList = await getAPIListFromPage();
      sendResponse({ code: 200, data: prList });
      return true;
    })();
    return true;
  }
  return true;
});
