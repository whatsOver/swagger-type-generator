import type {
  ApiList,
  Endpoints,
  Path,
  SwaggerDocs,
} from "@/entities/docs/model/types/docs";
import { Method } from "axios";

const extractDocsHref = async (): Promise<Path> => {
  const info = document.querySelector(".info");
  const href = info.querySelector("a")?.getAttribute("href");

  return { href: href ?? "", host: window.location.origin };
};

const fetchSwaggerJsonFromUrl = async (url: string): Promise<SwaggerDocs> => {
  const response = await fetch(url);
  const data = await response.json();
  return { data, href: url };
};

const fetchSwaggerJsonFromScript = async (): Promise<SwaggerDocs> => {
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

export const fetchSwaggerJson = async (): Promise<SwaggerDocs> => {
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

export const extractTagsAndEndpoints = (swaggerJson: any): ApiList => {
  const tags: string[] = [];
  const endpoints: Endpoints = {};

  Object.keys(swaggerJson.paths).forEach((path) => {
    Object.keys(swaggerJson.paths[path]).forEach((method) => {
      const tag = swaggerJson.paths[path][method].tags[0];
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
