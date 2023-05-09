import { useEffect, useState } from "react";
import { popupStyle } from "./styles/popup.css";
import { vars } from "./styles/theme.css";

interface API {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
}

interface APIList {
  endpoints: {
    [key: string]: API[];
  };
  tags: string[];
}

const Popup = () => {
  const [apiList, setAPIList] = useState<APIList>({
    endpoints: {},
    tags: [],
  });

  const checkIfReceiverIsReady = (
    tabId: number,
    callback: (isReady: boolean) => void
  ) => {
    chrome.tabs.sendMessage(tabId, { message: "READY" }, (response) => {
      if (chrome.runtime.lastError) {
        setTimeout(() => checkIfReceiverIsReady(tabId, callback), 1000);
      } else {
        callback(response.data);
      }
    });
  };

  const getAPIList = (tabId: number, callback: (data: APIList) => void) => {
    chrome.tabs.sendMessage(
      tabId,
      { message: "GET_SWAGGER_LIST" },
      (response) => {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
          setTimeout(() => getAPIList(tabId, callback), 1000);
        } else {
          callback(response.data);
        }
      }
    );
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      checkIfReceiverIsReady(tabs[0].id, (isReady) => {
        if (isReady) {
          getAPIList(tabs[0].id, (data) => {
            setAPIList(data);
          });
        } else {
          console.error("Error: Receiving end does not exist");
        }
      });
    });
  }, []);

  console.log(apiList);

  return (
    <div className={popupStyle.app}>
      <header>
        <ul className={popupStyle.apiList}>
          {apiList.tags.map((tag) => (
            <>
              <h2 className={popupStyle.tag}>{tag}</h2>
              <li className={popupStyle.tagBox} key={tag}>
                {apiList.endpoints[tag].map((api) => (
                  <button
                    style={{
                      backgroundColor: vars.methodBackgroundColors[api.method],
                      border: `2px solid ${vars.methodColors[api.method]}`,
                    }}
                    className={popupStyle.button}
                    key={api.path}
                  >
                    <div className={popupStyle.flexRow}>
                      <div
                        style={{
                          backgroundColor: vars.methodColors[api.method],
                        }}
                        className={popupStyle.methodItem}
                      >
                        {api.method}
                      </div>
                      <span className={popupStyle.path}>{api.path}</span>
                    </div>
                    <span className={popupStyle.description}>
                      {api.description}
                    </span>
                  </button>
                ))}
              </li>
            </>
          ))}
        </ul>
      </header>
    </div>
  );
};

export default Popup;
