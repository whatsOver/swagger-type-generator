import type { ApiList, Path } from "@/pages/content/modules/getApiList2";
import { create } from "zustand";

interface SwaggerDocStore {
  state: "initial" | "loaded";
  setState: (state: "initial" | "loaded") => void;

  ApiList: ApiList;
  setApiList: (ApiList: ApiList) => void;

  filteredApiList: ApiList;
  setFilteredApiList: (ApiList: ApiList) => void;

  pathInfo: Path;
  setPathInfo: (pathInfo: Path) => void;
}

export const useSwaggerDocStore = create<SwaggerDocStore>((set) => ({
  state: "initial",
  setState: (state: "initial" | "loaded") => set({ state }),
  filteredApiList: {
    endpoints: {},
    tags: [],
  },
  setFilteredApiList: (filteredApiList: ApiList) => set({ filteredApiList }),
  ApiList: {
    endpoints: {},
    tags: [],
  },
  setApiList: (ApiList: ApiList) => set({ ApiList }),
  pathInfo: {
    host: "",
    href: "",
  },
  setPathInfo: (pathInfo: Path) => set({ pathInfo }),
}));
