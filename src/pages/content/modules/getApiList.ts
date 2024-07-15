import { POST_API_LIST } from "@/entities/docs/model/types/docs";
import {
  extractScript,
  extractTagsAndEndpoints,
  fetchSwaggerJson,
} from "@/features/extract-api/module/utils/extract-api";

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
