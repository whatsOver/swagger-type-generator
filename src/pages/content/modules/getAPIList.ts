(async () => {
  const extractTagsAndEndpoints = async () => {
    const tagSections = document.querySelectorAll(".opblock-tag-section");
    const tags = [];
    const endpoints = {};

    tagSections.forEach((tagSection) => {
      const tagName = tagSection
        .querySelector(".opblock-tag")
        .textContent.trim();
      tags.push(tagName);

      tagSection.querySelectorAll(".opblock").forEach((opblock) => {
        const method = opblock.className
          .split("-")[1]
          .toUpperCase()
          .split(" ")[0];

        const path = opblock
          .querySelector(".opblock-summary-path")
          .textContent.trim();
        const description = opblock
          .querySelector(".opblock-summary-description")
          .textContent.trim();

        if (!endpoints[tagName]) {
          endpoints[tagName] = [];
        }

        endpoints[tagName].push({ method, path, description });
      });
    });

    return { tags, endpoints, host: window.location.host };
  };

  window.addEventListener("message", async (event) => {
    if (event.source === window && event.data.type === "GET_API_LIST") {
      const prList = await extractTagsAndEndpoints();
      window.postMessage(
        { type: "GET_API_LIST_RESULT", prList },
        window.location.origin
      );
    }
  });
})();
