/* eslint-disable @typescript-eslint/no-empty-function */
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Modal from "@/shared/ui/Modal";
import { vars } from "@/shared/ui/styles/theme.css";
import { ChangeEvent } from "react";
import { FcLock as LockIcon } from "react-icons/fc";
import { authModalStyle } from "./styles/auth.css";

export interface AuthModalProps {
  authorized: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSaveAuth: () => void;
  onClose?: () => void;
}

const AuthModal = ({ authorized, onChange, onSaveAuth }: AuthModalProps) => {
  return (
    <Modal>
      <Modal.Trigger
        as={
          <button onClick={() => {}}>
            <LockIcon size={24} />
          </button>
        }
      />
      <Modal.Content onClose={onSaveAuth}>
        <AuthModalContent
          {...{ authorized, onChange, onSaveAuth, onClose: onSaveAuth }}
        />
      </Modal.Content>
    </Modal>
  );
};

export default AuthModal;

interface AuthModalContentProps {
  authorized: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClose?: () => void;
}

export const AuthModalContent = ({
  authorized,
  onChange,
  onClose,
}: AuthModalContentProps) => {
  return (
    <div className={authModalStyle.modal}>
      <h2 className={authModalStyle.mainDescription}>Setting Authorize</h2>
      <section className={authModalStyle.inputWrapper}>
        <span className={authModalStyle.inputDescription}>Bearer</span>
        <Input value={authorized} onChange={onChange} />
      </section>
      <div className={authModalStyle.buttonWrapper}>
        <Button
          onClick={() => {
            // onSaveAuth();
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
