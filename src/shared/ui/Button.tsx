import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import {
  blueButtonStyles,
  buttonStyles,
  grayButtonStyles,
  greenButtonStyles,
  orangeButtonStyles,
  purpleButtonStyles,
  purpleLargeButtonStyles,
  redButtonStyles,
} from "./styles/button.css";

export type ButtonProps = {
  children: ReactNode;
  color?:
    | "blue"
    | "green"
    | "red"
    | "orange"
    | "purple"
    | "purpleLarge"
    | "gray"
    | "default";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, type = "button", color = "default", ...rest }, ref) => {
    return (
      <button
        type={type}
        ref={ref}
        className={classNames(buttonStyles, {
          [blueButtonStyles]: color === "blue",
          [greenButtonStyles]: color === "green",
          [redButtonStyles]: color === "red",
          [orangeButtonStyles]: color === "orange",
          [purpleButtonStyles]: color === "purple",
          [purpleLargeButtonStyles]: color === "purpleLarge",
          [grayButtonStyles]: color === "gray",
        })}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
