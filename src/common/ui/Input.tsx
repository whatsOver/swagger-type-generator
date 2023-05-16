import { ChangeEvent } from "react";
import { ComponentPropsWithRef } from "react";
import { ForwardRefRenderFunction } from "react";
import { inputStyle } from "./styles/input.css";

export type InputProps = {
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
} & ComponentPropsWithRef<"input">;

const Input: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { value, onChange, ...rest },
  ref
) => {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
      className={inputStyle.input}
      type="text"
      {...rest}
    />
  );
};

export default Input;
