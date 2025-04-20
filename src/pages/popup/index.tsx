import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { QueryProvider } from "@/app/providers/query-provider.js";
import { ScrollToTop } from "@/shared/ui/ScrollToTop.js";

import refreshOnUpdate from "virtual:reload-on-update-in-view";
import { DocsApiListFunnel } from "./pages/DocsApiListFunnel/DocsApiListFunnel.js";
import { DocsFunnel } from "./pages/DocsFunnel/DocsFunnel.js";
import { MultipleTestPage } from "./pages/MultipleTestPage/MultipleTestPage.js";
import { RequestPage } from "./pages/RequestPage/RequestPage.js";
import { ScenarioFunnel } from "./pages/ScenarioFunnel/ScenarioFunnel.js";
import { SwaggerDocsPage } from "./pages/SwaggerDocsPage.tsx/SwaggerDocsPage.js";

import "../../shared/ui/styles/reset.css.js";
import "./index.css";

refreshOnUpdate("pages/popup");

function init() {
  const appContainer = document.querySelector("#app-container");
  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }
  const root = createRoot(appContainer);

  root.render(
    <QueryProvider>
      <MemoryRouter>
        <ScrollToTop>
          <Routes>
            <Route path="*" element={<SwaggerDocsPage />} />
            <Route path="/request" element={<RequestPage />} />
            <Route path="/sequence/:id" element={<ScenarioFunnel />} />
            <Route
              path="/sequence/:id/test/:apiId"
              element={<MultipleTestPage />}
            />
            <Route path="/docs" element={<DocsFunnel />} />
            <Route path="/docs/:id" element={<DocsApiListFunnel />} />
          </Routes>
        </ScrollToTop>
      </MemoryRouter>
    </QueryProvider>
  );
}

init();
