import { ButtonHTMLAttributes, FunctionComponent, ReactNode } from "react";
import { buttonStyles } from "./styles/button.css";

export type ButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FunctionComponent<ButtonProps> = ({
  children,
  type = "button",
  ...rest
}) => {
  return (
    <button type={type} className={buttonStyles} {...rest}>
      {children}
    </button>
  );
};

export default Button;
