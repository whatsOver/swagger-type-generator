import "@pages/popup/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import "../../common/ui/styles/reset.css.ts";
import MultipleTestPage from "./Sequence/pages/Multiple/MultipleTestPage.js";
import Popup from "./pages/Popup/Popup.js";
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
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  root.render(
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

init();
