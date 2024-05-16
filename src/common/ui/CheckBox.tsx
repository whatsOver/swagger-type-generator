import React, {
  ChangeEventHandler,
  ForwardRefRenderFunction,
  forwardRef,
  useEffect,
  useState,
} from "react";
import {
  FaCheckCircle as CheckIcon,
  FaRegCircle as UnCheckIcon,
} from "react-icons/fa";
import { checkboxStyles } from "./styles/checkbox.css";
import { vars } from "./styles/theme.css";

type CheckBoxProps = {
  onChange?: (isChecked: boolean) => void;
  isChecked: boolean;
  onClick?: () => void;
} & Omit<
  React.ComponentPropsWithoutRef<"input">,
  "type" | "onChange" | "checked"
>;

export const CheckBox: ForwardRefRenderFunction<
  HTMLInputElement,
  CheckBoxProps
> = ({ id, onChange, isChecked, children, onClick, ...restProps }, ref) => {
  const [checked, setChecked] = useState<boolean>(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const _onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { checked } = event.target;
    setChecked(checked);
    onChange?.(checked);
    onClick && onClick();
  };

  return (
    <label htmlFor={id} className={checkboxStyles.labelStyle}>
      <input
        type={"checkbox"}
        id={id}
        onChange={_onChange}
        onClick={() => {
          onChange?.(true);
        }}
        checked={checked}
        {...restProps}
        ref={ref}
        className={checkboxStyles.inputStyle}
      />
      {checked ? (
        <div className={checkboxStyles.iconWrapper}>
          <CheckIcon size={20} color={vars.color.green} />
        </div>
      ) : (
        <div className={checkboxStyles.iconWrapper}>
          <UnCheckIcon size={20} color={vars.color.white} />
        </div>
      )}
      {children}
    </label>
  );
};

export default forwardRef(CheckBox);
