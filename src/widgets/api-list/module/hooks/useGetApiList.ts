import {
  ApiListType,
  GET_API_LIST_RESULT,
  Path,
} from "@/entities/docs/model/types/docs";
import { useSwaggerDocStore } from "@/entities/swagger/model/store/swaggerDocsStore";
import { useEffect, useState } from "react";

interface GetApiListProps {
  setApiList: (apiList: ApiListType) => void;
  setPathInfo: (pathInfo: Path) => void;
}

const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;

const useGetApiList = ({ setApiList, setPathInfo }: GetApiListProps) => {
  const [loading, setLoading] = useState(true);

  const checkIfReceiverIsReady = (
    tabId: number,
    callback: (isReady: boolean) => void,
    retryCount = 0,
    delay = INITIAL_DELAY
  ) => {
    if (retryCount >= MAX_RETRIES) {
      console.error("retry exceed max retries");
      setLoading(false);
      callback(false);
      return;
    }

    chrome.tabs.sendMessage(tabId, { message: "READY" }, (response) => {
      if (chrome.runtime.lastError) {
        const nextDelay = delay * 1.5;
        setTimeout(
          () =>
            checkIfReceiverIsReady(tabId, callback, retryCount + 1, nextDelay),
          delay
        );
      } else {
        setLoading(false);
        callback(response.data);
      }
    });
  };

  const getApiList = (
    tabId: number,
    callback: (data: GET_API_LIST_RESULT) => void,
    retryCount = 0,
    delay = INITIAL_DELAY
  ) => {
    if (retryCount >= MAX_RETRIES) {
      console.error("getApiList: retry exceed max retries");
      setLoading(false);
      return;
    }

    chrome.tabs.sendMessage(
      tabId,
      { message: "GET_SWAGGER_LIST" },
      (response) => {
        if (chrome.runtime.lastError) {
          const nextDelay = delay * 1.5;
          setTimeout(
            () => getApiList(tabId, callback, retryCount + 1, nextDelay),
            delay
          );
        } else {
          callback(response.data);
        }
      }
    );
  };

  const { state, setState } = useSwaggerDocStore();

  useEffect(() => {
    if (state === "loaded") {
      setLoading(false);
      return;
    }
    setLoading(true);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      checkIfReceiverIsReady(tabs[0].id, (isReady) => {
        if (isReady) {
          getApiList(tabs[0].id, (data) => {
            setApiList(data.prList);
            setPathInfo(data.path);
            setState("loaded");
          });
        } else {
          console.error("Error: Receiving end does not exist");
        }
      });
    });

    // Context menu를 위한 코드
    chrome.tabs.query({ active: true, currentWindow: false }, (tabs) => {
      if (tabs.length === 0) return;
      tabs.forEach((tab) =>
        checkIfReceiverIsReady(tab.id, (isReady) => {
          if (isReady) {
            getApiList(tab.id, (data) => {
              setApiList(data.prList);
              setPathInfo(data.path);
              setState("loaded");
            });
          }
        })
      );
    });
  }, [state]);

  return { loading };
};

export default useGetApiList;
