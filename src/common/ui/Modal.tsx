/* eslint-disable @typescript-eslint/no-empty-function */
import { useState, useEffect, useMemo, useRef, createContext } from "react";
import { modalStyle } from "./styles/modal.css";
import { useContext } from "react";
import { cloneElement } from "react";

const ModalContext = createContext<{
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: () => void;
}>({
  modalOpen: false,
  setModalOpen: () => {},
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
    onClose: () => {
      as.props.onClose();
      setModalOpen(false);
    },
  });
  return clonedTrigger;
};

interface ContentProps {
  children: React.ReactNode;
  onClose?: () => void;
}

const Content = ({ children, onClose }: ContentProps) => {
  const { modalOpen, setModalOpen } = useContext(ModalContext);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!modalOpen) {
    return null;
  }

  return (
    <div
      className={modalStyle.backdropStyle}
      onClick={() => {
        setModalOpen(false);
        onClose && onClose();
      }}
      style={{
        animation: `${
          modalOpen ? modalStyle.fadeIn : modalStyle.fadeOut
        } 500ms`,
      }}
    >
      <section
        className={modalStyle.modalStyle}
        ref={contentRef}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </section>
    </div>
  );
};

Modal.Trigger = Trigger;
Modal.Content = Content;

export default Modal;
