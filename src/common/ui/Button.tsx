import { ButtonHTMLAttributes, FunctionComponent, ReactNode } from "react";
import {
  blueButtonStyles,
  buttonStyles,
  greenButtonStyles,
} from "./styles/button.css";
import classNames from "classnames";

export type ButtonProps = {
  children: ReactNode;
  color?: "blue" | "green" | "default";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FunctionComponent<ButtonProps> = ({
  children,
  type = "button",
  color = "default",
  ...rest
}) => {
  return (
    <button
      type={type}
      className={classNames(buttonStyles, {
        [blueButtonStyles]: color === "blue",
        [greenButtonStyles]: color === "green",
      })}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
