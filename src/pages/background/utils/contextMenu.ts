const OPEN_POPUP = "OPEN_POPUP";

const createContextMenu = () => {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: OPEN_POPUP,
      title: "Open Swagger Inspector",
      contexts: ["all"],
    });
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === OPEN_POPUP) {
      chrome.windows.create({
        url: chrome.runtime.getURL("src/pages/popup/index.html"),
        type: "panel",
        tabId: tab.id,
        width: 500,
        height: 628,
      });
    }
  });
};

export default createContextMenu;
