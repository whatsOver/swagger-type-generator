import { API } from "@src/pages/content/modules/getAPIList";
import { SwaggerDocs } from "@src/pages/popup/api/docs";
import { RequestProps } from "@src/pages/popup/ui/Request";
import { Method } from "axios";

const convertSelectedAPI = (
  data: SwaggerDocs,
  api: API
): Omit<RequestProps, "host"> => {
  if (!data) return null;

  const method = api.method;
  const path = api.path;
  const description = api.description;
  const parameters =
    data.paths[path][method.toLowerCase() as Method].parameters;

  console.log(data.paths[api.path][method.toLowerCase() as Method].requestBody);

  let schemaName = "";
  const requestBody =
    data.paths[api.path][method.toLowerCase() as Method].requestBody;
  if (requestBody) {
    const schema = requestBody.content["application/json"].schema;
    if ("$ref" in schema) {
      schemaName = schema.$ref.split("/")[3];
    } else if (schema.type === "array") {
      schemaName = schema.items.$ref.split("/")[3];
    }
  }
  const body = data.components.schemas[schemaName];
  console.log(body);

  return {
    method,
    path,
    description,
    params: parameters,
    body,
  };
};

export { convertSelectedAPI };
