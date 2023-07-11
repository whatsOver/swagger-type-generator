import { create } from "zustand";

interface SettingStore {
  withReactQuery: boolean;
  toggleReactQuery: () => void;
}

const useSettingStore = create<SettingStore>((set) => ({
  withReactQuery: true,
  toggleReactQuery: () =>
    set((state) => ({ withReactQuery: !state.withReactQuery })),
}));

export default useSettingStore;
