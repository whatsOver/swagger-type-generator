/* eslint-disable @typescript-eslint/no-empty-function */

import { noop } from "@/shared/util/common";
import CodeBlock from "@/widgets/code-block/ui/code-block/CodeBlock";
import classNames from "classnames";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  modalFadeIn,
  modalFadeOut,
  modalShowOut,
  modalShowUp,
  modalStyle,
} from "./styles/modal.css";

const ModalContext = createContext<{
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: () => void;
}>({
  modalOpen: false,
  setModalOpen: noop,
});

interface ModalProps {
  children: React.ReactNode;
}

const Modal = ({ children }: ModalProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const keydownCB = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalOpen(false);
      }
    };

    if (modalOpen) document.addEventListener("keydown", keydownCB);
    else document.removeEventListener("keydown", keydownCB);

    return () => {
      document.removeEventListener("keydown", keydownCB);
    };
  }, [modalOpen]);

  const contextValue = useMemo(
    () => ({ modalOpen, setModalOpen }),
    [modalOpen, setModalOpen]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

interface TriggerProps {
  as: React.ReactElement;
}

const Trigger = ({ as }: TriggerProps) => {
  const { modalOpen, setModalOpen } = useContext(ModalContext);

  const clonedTrigger = cloneElement(as, {
    onClick: () => {
      as.props.onClick();
      setModalOpen(!modalOpen);
    },
  });
  return clonedTrigger;
};

interface ContentProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export interface ModalChildProps {
  onClose?: () => void;
}

const Content = ({ children, onClose }: ContentProps) => {
  const { modalOpen, setModalOpen } = useContext(ModalContext);
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalOpen === true) {
      setOpen(true);
      setModalOpen(true);
    } else {
      setTimeout(() => {
        setOpen(false);
      }, 450);
    }
  }, [modalOpen]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    onClose && onClose();
  }, [onClose, setModalOpen]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={classNames(
        modalStyle.backdropStyle,
        modalOpen ? modalFadeIn : modalFadeOut
      )}
      onClick={handleCloseModal}
      style={{
        animation: `${
          modalOpen ? modalStyle.fadeIn : modalStyle.fadeOut
        } 500ms`,
      }}
    >
      <section
        className={classNames(
          modalStyle.modalStyle,
          modalOpen ? modalShowUp : modalShowOut
        )}
        ref={contentRef}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {Children.map(children, (child) => {
          if (isValidElement<ContentProps>(child) && child.type === CodeBlock) {
            return cloneElement(child, { onClose: handleCloseModal });
          }
          if (isValidElement<ModalChildProps>(child)) {
            return cloneElement(child, {
              onClose: () => {
                child.props.onClose();
                handleCloseModal();
              },
            });
          }

          return child;
        })}
      </section>
    </div>
  );
};

Modal.Trigger = Trigger;
Modal.Content = Content;

export default Modal;
