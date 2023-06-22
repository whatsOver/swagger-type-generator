import { APIList, Path } from "@src/pages/content/modules/getAPIList";
import { create } from "zustand";

interface SwaggerDocStore {
  state: "initial" | "loaded";
  setState: (state: "initial" | "loaded") => void;

  apiList: APIList;
  setAPIList: (apiList: APIList) => void;

  filteredAPIList: APIList;
  setFilteredAPIList: (apiList: APIList) => void;

  pathInfo: Path;
  setPathInfo: (pathInfo: Path) => void;
}

const useSwaggerDocStore = create<SwaggerDocStore>((set) => ({
  state: "initial",
  setState: (state: "initial" | "loaded") => set({ state }),
  filteredAPIList: {
    endpoints: {},
    tags: [],
  },
  setFilteredAPIList: (filteredAPIList: APIList) => set({ filteredAPIList }),
  apiList: {
    endpoints: {},
    tags: [],
  },
  setAPIList: (apiList: APIList) => set({ apiList }),
  pathInfo: {
    host: "",
    href: "",
  },
  setPathInfo: (pathInfo: Path) => set({ pathInfo }),
}));

export default useSwaggerDocStore;
