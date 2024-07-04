import { Path } from "@/pages/content/modules/getApiList2";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SwaggerDocs } from "../types";

const getSwaggerDocs = async ({ host, href }: Path): Promise<SwaggerDocs> => {
  const isFullUrl = href.includes("http");
  const { data } = await axios.get(isFullUrl ? href : `${host}${href}`);
  return data;
};

const getSwaggerDocsFromPage = async (): Promise<SwaggerDocs> => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { message: "GET_SWAGGER_DOCS" },
        (response) => {
          if (chrome.runtime.lastError) {
            // console.log(chrome.runtime.lastError);
            // setTimeout(() => getSwaggerDocsFromPage(), 1000);
          } else {
            resolve(response.data);
          }
        }
      );
    });
    // TODO : 리펙토링 하기
    chrome.tabs.query({ active: true, currentWindow: false }, (tabs) => {
      tabs.forEach((tab) =>
        chrome.tabs.sendMessage(
          tab.id,
          { message: "GET_SWAGGER_DOCS" },
          (response) => {
            if (chrome.runtime.lastError) {
              // console.log(chrome.runtime.lastError);
              // setTimeout(() => getSwaggerDocsFromPage(), 1000);
            } else {
              resolve(response.data);
            }
          }
        )
      );
    });
  });
};

export const GET_SWAGGER_DOCS_KEY = (href: string) => ["getDocs", href];

export const useGETDocs = ({ host, href }: Path) => {
  if (!href) {
    return useQuery(
      GET_SWAGGER_DOCS_KEY(href),
      async () => await getSwaggerDocsFromPage()
    );
  }

  return useQuery(
    GET_SWAGGER_DOCS_KEY(href),
    async () => await getSwaggerDocs({ host, href }),
    {
      enabled: !!href,
    }
  );
};
