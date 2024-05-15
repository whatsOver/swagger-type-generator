import { create } from "zustand";

interface SettingStore {
  withReactQuery: boolean;
  toggleReactQuery: () => void;
}

const useSettingStore = create<SettingStore>((set) => ({
  withReactQuery: false,
  toggleReactQuery: () =>
    set((state) => ({ withReactQuery: !state.withReactQuery })),
}));

export default useSettingStore;
