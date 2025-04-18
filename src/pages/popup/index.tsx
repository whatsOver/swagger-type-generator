import { QueryProvider } from "@/app/providers/query-provider.js";
import { ScrollToTop } from "@/shared/ui/ScrollToTop.js";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import "../../shared/ui/styles/reset.css.js";
import "./index.css";
import { ApiListPage } from "./pages/ApiList/ui/ApiList.js";
import { DocsPage } from "./pages/Docs/DocsPage.js";
import { DocsApiListFunnel } from "./pages/DocsApiListFunnel/DocsApiListFunnel.js";
import MultipleTestPage from "./pages/Multiple/MultipleTestPage.js";
import Request from "./pages/Request/Request";
import ScenarioFunnel from "./pages/ScenarioFunnel/ScenarioFunnel.js";
import SequenceFunnel from "./pages/SequenceFunnel/SequenceFunnel.js";

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
            <Route path="/api-add" element={<ApiListPage />} />
            <Route path="/request" element={<Request />} />
            <Route path="/sequence" element={<SequenceFunnel />} />
            <Route path="/sequence/:id" element={<ScenarioFunnel />} />
            <Route
              path="/sequence/:id/test/:apiId"
              element={<MultipleTestPage />}
            />
            <Route path="/" element={<DocsPage />} />
            <Route path="/docs/:id" element={<DocsApiListFunnel />} />
          </Routes>
        </ScrollToTop>
      </MemoryRouter>
    </QueryProvider>
  );
}

init();
