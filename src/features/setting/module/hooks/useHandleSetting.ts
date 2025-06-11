import { useSettingStore } from "@/entities/setting/model/setting-store";
import { noop } from "@/shared/util/common";

const useHandleSetting = () => {
  const { withReactQuery, toggleReactQuery } = useSettingStore();

  const onSaveSetting = noop;

  return { withReactQuery, toggleReactQuery, onSaveSetting };
};

export default useHandleSetting;
