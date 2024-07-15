import type { ApiList, Path } from "@/entities/docs/model/types/docs";
import { create } from "zustand";

interface SwaggerDocStore {
  state: "initial" | "loaded";
  setState: (state: "initial" | "loaded") => void;

  apiList: ApiList;
  setApiList: (ApiList: ApiList) => void;

  filteredApiList: ApiList;
  setFilteredApiList: (ApiList: ApiList) => void;

  pathInfo: Path;
  setPathInfo: (pathInfo: Path) => void;
}

export const useSwaggerDocStore = create<SwaggerDocStore>((set) => ({
  state: "initial",
  setState: (state: "initial" | "loaded") => set({ state }),
  apiList: {
    endpoints: {},
    tags: [],
  },
  setApiList: (apiList: ApiList) => set({ apiList }),
  filteredApiList: {
    endpoints: {},
    tags: [],
  },
  setFilteredApiList: (filteredApiList: ApiList) => set({ filteredApiList }),
  pathInfo: {
    host: "",
    href: "",
  },
  setPathInfo: (pathInfo: Path) => set({ pathInfo }),
}));
