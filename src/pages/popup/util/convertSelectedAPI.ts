import { API_ITEM } from "@src/pages/popup/Popup";
import { SwaggerDocs } from "@src/pages/popup/api/docs";
import { RequestProps } from "@src/pages/popup/ui/Request";
import { Method } from "axios";

const convertSelectedAPI = (
  data: SwaggerDocs,
  api: API_ITEM
): Omit<RequestProps, "host"> => {
  if (!data) return null;

  const method = api.method;
  const path = api.path;
  const description = api.description;
  const parameters =
    data.paths[path][method.toLowerCase() as Method].parameters;

  const schemaName =
    data.paths[api.path][method.toLowerCase() as Method].requestBody?.content[
      "application/json"
    ].schema.$ref.split("/")[3];
  const body = data.components.schemas[schemaName];

  return {
    method,
    path,
    description,
    params: parameters,
    body,
  };
};

export { convertSelectedAPI };
