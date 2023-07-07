import useSettingStore from "../../store/setting";

const useHandleSetting = () => {
  const { withReactQuery, toggleReactQuery } = useSettingStore();

  const onSaveSetting = () => {
    console.log("Save setting");
  };

  return { withReactQuery, toggleReactQuery, onSaveSetting };
};

export default useHandleSetting;
