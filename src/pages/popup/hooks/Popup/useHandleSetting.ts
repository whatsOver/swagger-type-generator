import { useSettingStore } from "@/entities/setting/model/setting-store";

const useHandleSetting = () => {
  const { withReactQuery, toggleReactQuery } = useSettingStore();

  const onSaveSetting = () => {
    console.log("Save setting");
  };

  return { withReactQuery, toggleReactQuery, onSaveSetting };
};

export default useHandleSetting;
