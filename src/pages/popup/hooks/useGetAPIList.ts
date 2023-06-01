import {
  APIList,
  GET_API_LIST_RESULT,
  Path,
} from "@src/pages/content/modules/getAPIList";
import { SetStateAction } from "react";
import { Dispatch } from "react";
import { useEffect } from "react";

interface GetAPIListProps {
  setAPIList: Dispatch<SetStateAction<APIList>>;
  setPathInfo: Dispatch<SetStateAction<Path>>;
}

const useGetAPIList = ({ setAPIList, setPathInfo }: GetAPIListProps) => {
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

  const getAPIList = (
    tabId: number,
    callback: (data: GET_API_LIST_RESULT) => void
  ) => {
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
            setAPIList(data.prList);
            setPathInfo(data.path);
          });
        } else {
          console.error("Error: Receiving end does not exist");
        }
      });
    });
    // Context menu를 위한 코드
    chrome.tabs.query({ active: true, currentWindow: false }, (tabs) => {
      if (tabs.length === 0) return;
      checkIfReceiverIsReady(tabs[0].id, (isReady) => {
        if (isReady) {
          getAPIList(tabs[0].id, (data) => {
            setAPIList(data.prList);
            setPathInfo(data.path);
          });
        } else {
          console.error("Error: Receiving end does not exist");
        }
      });
    });
  }, []);
};

export default useGetAPIList;
