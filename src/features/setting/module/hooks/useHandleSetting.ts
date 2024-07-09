import { useSettingStore } from "@/entities/setting/model/setting-store";

const useHandleSetting = () => {
  const { withReactQuery, toggleReactQuery } = useSettingStore();

  const onSaveSetting = () => {};

  return { withReactQuery, toggleReactQuery, onSaveSetting };
};

export default useHandleSetting;
