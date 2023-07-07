/* eslint-disable @typescript-eslint/no-empty-function */
import Modal from "@src/common/ui/Modal";
import LogoImg from "@assets/img/react-query-logo.png";
import { IoIosSettings as SettingIcon } from "react-icons/io";
import Button from "@src/common/ui/Button";
import { vars } from "@src/common/ui/styles/theme.css";
import { settingModalStyle } from "./styles/setting.css";

export interface SettingModalProps {
  withReactQuery: boolean;
  toggleReactQuery: () => void;
  onSaveSetting: () => void;
}

const SettingModal = ({
  withReactQuery,
  toggleReactQuery,
  onSaveSetting,
}: SettingModalProps) => {
  return (
    <Modal>
      <Modal.Trigger
        as={
          <button onClick={() => {}}>
            <SettingIcon size={24} color={vars.color.lightGreen} />
          </button>
        }
      />
      <Modal.Content onClose={onSaveSetting}>
        <AuthModalContent
          {...{ withReactQuery, toggleReactQuery, onClose: onSaveSetting }}
        />
      </Modal.Content>
    </Modal>
  );
};

export default SettingModal;

type AuthModalContentProps = {
  onClose?: () => void;
} & Omit<SettingModalProps, "onSaveSetting">;

export const AuthModalContent = ({
  withReactQuery,
  toggleReactQuery,
  onClose,
}: AuthModalContentProps) => {
  return (
    <div className={settingModalStyle.modal}>
      <h2 className={settingModalStyle.mainDescription}>Settings</h2>
      <section className={settingModalStyle.inputWrapper}>
        <div className={settingModalStyle.imgAndIconWrapper}>
          <img
            className={settingModalStyle.logoImg}
            src={LogoImg}
            alt="react-query-logo"
          />
          <span className={settingModalStyle.inputDescription}>
            With React Query
          </span>
        </div>
        <input
          className={settingModalStyle.checkboxStyle}
          type="checkbox"
          id="coding"
          name="setting"
          value="withReactQuery"
          checked={withReactQuery}
          onChange={toggleReactQuery}
        />
      </section>
      <div className={settingModalStyle.buttonWrapper}>
        <Button
          onClick={() => {
            onClose && onClose();
          }}
          style={{ backgroundColor: vars.color.green }}
        >
          SAVE
        </Button>
      </div>
    </div>
  );
};
