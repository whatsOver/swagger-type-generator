import Drawer from "@/shared/ui/Drawer";
import { useNavigate } from "react-router-dom";
import { settingDrawerStyles } from "./styles/settingDrawer.css";

interface SettingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingDrawer = ({ isOpen, onClose }: SettingDrawerProps) => {
  const router = useNavigate();

  const onClick_APIList = () => {
    router("/");
    onClose();
  };

  const onClick_Sequence = () => {
    router("/sequence");
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <Item text="API List" onClick={onClick_APIList} />
      <Item text="Sequence" onClick={onClick_Sequence} />
    </Drawer>
  );
};

export default SettingDrawer;

interface ItemProps {
  text: string;
  onClick?: () => void;
}

const Item = ({ text, onClick }: ItemProps) => {
  const handleClick = () => {
    onClick && onClick();
  };

  return (
    <button className={settingDrawerStyles.listButton} onClick={handleClick}>
      <div className={settingDrawerStyles.list}>
        <span className={settingDrawerStyles.itemText}>{text}</span>
      </div>
    </button>
  );
};
