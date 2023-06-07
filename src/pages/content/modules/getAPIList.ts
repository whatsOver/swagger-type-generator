import { Method } from "axios";

declare global {
  interface Window {
    swaggerOptions: {
      swaggerDoc: string;
    };
  }
}

export type POST_API_LIST = {
  type: "GET_API_LIST_RESULT";
  data: {
    prList: APIList;
    path: Path;
    script: string;
  };
};

export type GET_API_LIST_RESULT = {
  type: "GET_API_LIST_RESULT";
  prList: APIList;
  path: Path;
};

export interface APIList {
  tags: string[];
  endpoints: Endpoints;
}

export interface Path {
  href: string;
  host: string;
}

export interface Endpoints {
  [key: string]: API[];
}

export interface API {
  method: Method;
  path: string;
  description: string;
}

(async () => {
  const extractTagsAndEndpoints = async (): Promise<APIList> => {
    const tagSections = document.querySelectorAll(".opblock-tag-section");
    const tags: string[] = [];
    const endpoints: Endpoints = {};

    tagSections.forEach((tagSection) => {
      const tagName = tagSection
        .querySelector(".opblock-tag")
        .textContent.trim();
      tags.push(tagName);

      tagSection.querySelectorAll(".opblock").forEach((opblock) => {
        const method = opblock.className
          .split("-")[1]
          .toUpperCase()
          .split(" ")[0]
          .toLowerCase() as Method;

        const path = opblock
          .querySelector(".opblock-summary-path")
          .textContent.trim();
        const description = opblock
          .querySelector(".opblock-summary-description")
          .textContent.trim();

        if (!endpoints[tagName]) endpoints[tagName] = [];

        endpoints[tagName].push({ method, path, description });
      });
    });

    return {
      tags,
      endpoints,
    };
  };

  const extractDocsHref = async (): Promise<Path> => {
    const info = document.querySelector(".info");
    const href = info.querySelector("a").getAttribute("href");
    return { href, host: window.location.origin };
  const extractScript = async (): Promise<string> => {
    const scripts = Array.from(document.scripts);
    const swaggerScript = scripts.find((script) =>
      script.src.includes("swagger-ui-init.js")
    );

    if (!swaggerScript) return "";
    return await fetch(swaggerScript.src)
      .then((response) => response.text())
      .then((scriptContent) => {
        const optionsRegex =
          /let options = ({.*?});\s*url = options.swaggerUrl/gms;
        const match = optionsRegex.exec(scriptContent);

        if (match && match[1]) {
          const options = JSON.parse(match[1]);
          return options.swaggerDoc;
        } else {
          return "";
        }
      });
  };

  window.addEventListener("message", async (event) => {
    if (event.source === window && event.data.type === "GET_API_LIST") {
      const prList = await extractTagsAndEndpoints();
      const path = await extractDocsHref();
      const nestScript = await extractScript();

      window.postMessage(
        {
          type: "GET_API_LIST_RESULT",
          data: { prList, path, script: nestScript },
        } as POST_API_LIST,
        window.location.origin
      );
    }
  });
})();
