import { ReactNode } from "react";
import { AiOutlineClose as CloseIcon } from "react-icons/ai";
import { drawerStyles } from "./styles/drawer.css";
import classNames from "classnames";
import { vars } from "./styles/theme.css";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Drawer = ({ isOpen, onClose, children }: DrawerProps) => {
  return (
    <>
      <div
        className={classNames(
          drawerStyles.overlayBase,
          isOpen ? drawerStyles.overlayOpen : drawerStyles.overlayClose
        )}
        onClick={onClose}
      />
      <div
        className={classNames(
          drawerStyles.container,
          isOpen ? drawerStyles.containerOpen : drawerStyles.containerClose
        )}
      >
        <button className={drawerStyles.closeButton} onClick={onClose}>
          <CloseIcon size={20} color={vars.color.white} />
        </button>
        {children}
      </div>
    </>
  );
};

export default Drawer;
