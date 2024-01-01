/* eslint-disable @typescript-eslint/no-empty-function */
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useContext,
  forwardRef,
  useImperativeHandle,
} from "react";
import { dropDownStyles } from "./styles/dropdown.css";
import classNames from "classnames";
import { ButtonHTMLAttributes } from "react/ts5.0";

const DropdownContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({ isOpen: false, setIsOpen: () => {} });

const Dropdown = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", closeOnEscape);
      return () => document.removeEventListener("keydown", closeOnEscape);
    }
  }, [isOpen]);

  const contextValue = useMemo(
    () => ({ isOpen, setIsOpen }),
    [isOpen, setIsOpen]
  );

  return (
    <DropdownContext.Provider value={contextValue}>
      {children}
    </DropdownContext.Provider>
  );
};

type TriggerProps = {
  as: React.ReactElement;
} & ButtonHTMLAttributes<HTMLButtonElement>;

interface TriggerRef {
  getBoundingClientRect: () => DOMRect;
}

const Trigger = forwardRef<TriggerRef, TriggerProps>(({ as }, ref) => {
  const { isOpen, setIsOpen } = useContext(DropdownContext);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle(ref, () => ({
    getBoundingClientRect: () => {
      if (triggerRef.current) {
        return triggerRef.current.getBoundingClientRect();
      }
      return new DOMRect();
    },
  }));

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const { y, height } = triggerRef.current.getBoundingClientRect();
      const modal = document.querySelector<HTMLElement>("#modal-wrapper");
      if (modal) {
        modal.style.top = `${y + height}px`;
      }
    }
  }, [isOpen]);

  const clonedTrigger = React.cloneElement(as, {
    ref: triggerRef,
    onClick: () => {
      as.props.onClick?.();
      setIsOpen(!isOpen);
    },
    id: "trigger",
  });

  return clonedTrigger;
});

Trigger.displayName = "Trigger";

const Modal = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, setIsOpen } = useContext(DropdownContext);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const modalTrigger = document.querySelector("#trigger");
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        modalTrigger !== e.target
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="modal-wrapper"
      ref={modalRef}
      className={classNames(
        dropDownStyles.modalWrapperStyle,
        isOpen ? dropDownStyles.showAnimation : dropDownStyles.hideAnimation
      )}
      onClick={handleCloseModal}
    >
      {children}
    </div>
  );
};

const Item = ({
  children,
  onClick,
}: {
  children: string;
  onClick?: () => void;
}) => {
  const { setIsOpen } = useContext(DropdownContext);

  const handleClick = () => {
    if (onClick) onClick();
    setIsOpen(false);
  };

  return (
    <button className={dropDownStyles.listButtonStyle} onClick={handleClick}>
      {children}
    </button>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.Modal = Modal;
Dropdown.Item = Item;

export default Dropdown;
