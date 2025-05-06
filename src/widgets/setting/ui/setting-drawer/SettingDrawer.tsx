import Drawer from "@/shared/ui/Drawer";
import { useNavigate } from "react-router-dom";
import { settingDrawerStyles } from "./settingDrawer.css";

interface SettingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingDrawer = ({ isOpen, onClose }: SettingDrawerProps) => {
  const router = useNavigate();

  const onClickSwaggerDocs = () => {
    router("/");
    onClose();
  };

  const onClickMyDocs = () => {
    router("/docs");
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <Item text="Swagger Docs" onClick={onClickSwaggerDocs} />
      <Item text="My Docs" onClick={onClickMyDocs} />
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
