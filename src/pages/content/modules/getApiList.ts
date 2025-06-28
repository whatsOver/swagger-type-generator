import {
  ApiListType,
  BrowserSwaggerDocs,
  Endpoints,
  Path,
  POST_API_LIST,
} from "@/entities/docs/model/types/docs";
import { SwaggerDocs } from "@/entities/swagger/types";
import { Method } from "axios";

// FIXME import 부분 오류 수정
/**
 * import {
  extractScript,
  extractTagsAndEndpoints,
  fetchSwaggerJson,
} from "@/features/extract-api/module/utils/extract-api";
 */

const extractDocsHref = async (): Promise<Path> => {
  const info = document.querySelector(".info");
  const href = info.querySelector("a")?.getAttribute("href");

  return { href: href ?? "", host: window.location.origin };
};

const fetchSwaggerJsonFromUrl = async (
  url: string
): Promise<BrowserSwaggerDocs> => {
  const response = await fetch(url);
  const data = await response.json();
  return { data, href: url };
};

const fetchSwaggerJsonFromScript = async (): Promise<BrowserSwaggerDocs> => {
  const scripts = Array.from(document.scripts);
  const swaggerScript = scripts.find((script) =>
    script.src.includes("swagger-ui-init.js")
  );

  if (!swaggerScript) return null;
  const data = await fetch(swaggerScript.src)
    .then((response) => response.text())
    .then((scriptContent) => {
      const optionsRegex =
        /let options = ({.*?});\s*url = options.swaggerUrl/gms;
      const match = optionsRegex.exec(scriptContent);

      if (match && match[1]) {
        const options = JSON.parse(match[1]);

        const swaggerDoc = options.swaggerDoc;
        if (typeof swaggerDoc === "string") {
          return fetchSwaggerJsonFromUrl(swaggerDoc);
        } else if (swaggerDoc && typeof swaggerDoc === "object") {
          return swaggerDoc;
        } else {
          return null;
        }
      } else {
        return null;
      }
    });

  return { data, href: "" };
};

export const fetchSwaggerJson = async (): Promise<BrowserSwaggerDocs> => {
  const swaggerJsonFromScript = await fetchSwaggerJsonFromScript();
  if (swaggerJsonFromScript) {
    return swaggerJsonFromScript;
  }

  const path = await extractDocsHref();

  if (path.href) {
    const swaggerJsonFromUrl = await fetchSwaggerJsonFromUrl(path.href);
    return swaggerJsonFromUrl;
  }

  const swaggerJsonFromUrl = await fetchSwaggerJsonFromUrl("/swagger.json");
  if (swaggerJsonFromUrl) {
    return swaggerJsonFromUrl;
  }

  throw new Error("Unable to fetch Swagger JSON");
};

export const extractTagsAndEndpoints = (
  swaggerJson: SwaggerDocs
): ApiListType => {
  const tags: string[] = [];
  const endpoints: Endpoints = {};

  Object.keys(swaggerJson.paths).forEach((path) => {
    Object.keys(swaggerJson.paths[path]).forEach((method) => {
      const tag = swaggerJson.paths[path][method]?.tags?.[0];
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
      if (!endpoints[tag]) {
        endpoints[tag] = [];
      }
      endpoints[tag].push({
        method: method as Method,
        path,
        description:
          swaggerJson.paths[path][method].description ??
          swaggerJson.paths[path][method].summary,
        summary:
          swaggerJson.paths[path][method].summary ??
          swaggerJson.paths[path][method].description,
      });
    });
  });

  return { tags, endpoints };
};

export const extractScript = async (): Promise<string> => {
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

const handleGetApiList = async () => {
  try {
    const swaggerJson = await fetchSwaggerJson();
    const prList = extractTagsAndEndpoints(swaggerJson.data);
    const path = { href: swaggerJson.href, host: window.location.origin };
    const script = await extractScript();

    const postData: POST_API_LIST = {
      type: "GET_API_LIST_RESULT",
      data: { prList, path, script },
    };

    window.postMessage(postData, window.location.origin);
  } catch (error) {
    console.error("Error fetching Swagger JSON:", error);
  }
};

window.addEventListener("message", async (event) => {
  if (event.source === window && event.data.type === "GET_API_LIST") {
    await handleGetApiList();
  }
});
