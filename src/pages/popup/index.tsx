import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import "../../shared/ui/styles/reset.css.js";
import MultipleTestPage from "./Sequence/pages/Multiple/MultipleTestPage.js";
import { QueryProvider } from "./app/index.js";
import "./index.css";
import Popup from "./pages/ApiList/ui/ApiList.js";
import Request from "./pages/Request/Request";
import ScenarioFunnel from "./pages/ScenarioFunnel/ScenarioFunnel.js";
import SequenceFunnel from "./pages/SequenceFunnel/SequenceFunnel.js";
import ScrollToTop from "./ui/ScrollToTop";

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
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Popup />} />
          <Route path="/request" element={<Request />} />
          <Route path="/sequence" element={<SequenceFunnel />} />
          <Route path="/sequence/:id" element={<ScenarioFunnel />} />
          <Route
            path="/sequence/:id/test/:apiId"
            element={<MultipleTestPage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryProvider>
  );
}

init();
