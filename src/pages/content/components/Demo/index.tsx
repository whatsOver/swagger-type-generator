import { createRoot } from "react-dom/client";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import App from "./app";

refreshOnUpdate("pages/content");

const root = document.createElement("div");
root.id = "chrome-extension-boilerplate-react-vite-content-view-root";
document.body.append(root);

createRoot(root).render(<App />);
