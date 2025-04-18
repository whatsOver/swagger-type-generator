import type { ApiListType, Path } from "@/entities/docs/model/types/docs";
import { create } from "zustand";

interface SwaggerDocStore {
  state: "initial" | "loaded";
  setState: (state: "initial" | "loaded") => void;

  apiList: ApiListType;
  setApiList: (ApiList: ApiListType) => void;

  filteredApiList: ApiListType;
  setFilteredApiList: (ApiList: ApiListType) => void;

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
  setApiList: (apiList: ApiListType) => set({ apiList }),
  filteredApiList: {
    endpoints: {},
    tags: [],
  },
  setFilteredApiList: (filteredApiList: ApiListType) =>
    set({ filteredApiList }),
  pathInfo: {
    host: "",
    href: "",
  },
  setPathInfo: (pathInfo: Path) => set({ pathInfo }),
}));
