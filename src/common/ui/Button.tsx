import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import {
  blueButtonStyles,
  buttonStyles,
  greenButtonStyles,
  orangeButtonStyles,
  purpleButtonStyles,
  redButtonStyles,
} from "./styles/button.css";
import classNames from "classnames";

export type ButtonProps = {
  children: ReactNode;
  color?: "blue" | "green" | "red" | "orange" | "purple" | "default";
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
