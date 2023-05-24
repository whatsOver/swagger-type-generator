import React from "react";
import { createRoot } from "react-dom/client";
import "@pages/popup/index.css";
import Popup from "@pages/popup/Popup";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import Request from "./ui/Request";
import "../../common/ui/styles/reset.css.ts";
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
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

init();
