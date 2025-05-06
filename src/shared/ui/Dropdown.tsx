/* eslint-disable @typescript-eslint/no-empty-function */
import classNames from "classnames";
import React, {
  ButtonHTMLAttributes,
  MouseEvent,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { dropDownStyles } from "./styles/dropdown.css";

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
      const { y, height, left, top, width } =
        triggerRef.current.getBoundingClientRect();
      const modal = document.querySelector<HTMLElement>("#modal-wrapper");

      if (modal) {
        // 화면 내 위치 계산
        const windowHeight = window.innerHeight;
        const safetyMargin = 10; // 여유 공간 (픽셀)

        // 드롭다운 메뉴를 렌더링한 다음 실제 높이를 측정
        modal.style.visibility = "hidden"; // 측정 중에는 보이지 않게 함
        modal.style.top = "0";
        modal.style.left = "0";

        // 드롭다운 높이 측정
        const modalHeight = modal.offsetHeight || 240; // 측정 실패 시 기본값 사용

        // 아래쪽 공간 체크 (화면 아래쪽 경계와의 거리)
        const bottomSpace = windowHeight - (y + height);

        // 위치 계산 및 설정
        modal.style.visibility = "visible"; // 다시 보이게 함

        // 아래쪽 공간이 부족하다면 위쪽에 표시
        if (bottomSpace < modalHeight + safetyMargin) {
          modal.style.top = `${top - modalHeight - safetyMargin}px`;
          modal.classList.add(dropDownStyles.dropdownTop);
        } else {
          modal.style.top = `${y + height + safetyMargin}px`;
          modal.classList.remove(dropDownStyles.dropdownTop);
        }

        modal.style.left = `${left}px`;
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
    const handleClickOutside = (e: globalThis.MouseEvent) => {
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
  name,
  onClick,
}: {
  children: string;
  name?: string;
  onClick?: (name: string) => void;
}) => {
  const { setIsOpen } = useContext(DropdownContext);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e.currentTarget.name);
    setIsOpen(false);
  };

  return (
    <button
      name={name}
      className={dropDownStyles.listButtonStyle}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.Modal = Modal;
Dropdown.Item = Item;

export default Dropdown;
