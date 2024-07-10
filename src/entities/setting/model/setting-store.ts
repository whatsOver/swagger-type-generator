import { create } from "zustand";
interface SettingStore {
  withReactQuery: boolean;
  toggleReactQuery: () => void;
}

export const useSettingStore = create<SettingStore>((set) => ({
  withReactQuery: false,
  toggleReactQuery: () =>
    set((state) => ({ withReactQuery: !state.withReactQuery })),
}));
