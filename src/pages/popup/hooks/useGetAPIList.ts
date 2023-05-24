import { SetStateAction } from "react";
import { Dispatch } from "react";
import { useEffect } from "react";

export interface API {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
}

export interface APIList {
  endpoints: {
    [key: string]: API[];
  };
  tags: string[];
  host: string;
}

interface GetAPIListProps {
  setAPIList: Dispatch<SetStateAction<APIList>>;
}

const useGetAPIList = ({ setAPIList }: GetAPIListProps) => {
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
};

export default useGetAPIList;
