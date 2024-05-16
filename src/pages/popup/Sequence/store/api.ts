import { create } from "zustand";
import { APIWithOrder } from "./sequence";

interface apiStore {
  apis: APIWithOrder[];
  setApis: (apis: APIWithOrder[]) => void;
}

const useAPIStore = create<apiStore>((set) => ({
  apis: [],
  setApis: (apis: APIWithOrder[]) => set({ apis }),
}));

export default useAPIStore;
