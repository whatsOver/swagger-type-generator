import React, { ElementType } from "react";
import { text, TextVariants } from "./text.css";

type TextOwnProps<E extends ElementType = ElementType> = TextVariants & {
  as?: E;
  children: React.ReactNode;
  className?: string;
};

type TextProps<E extends ElementType> = TextOwnProps<E> &
  Omit<React.ComponentProps<E>, keyof TextOwnProps | "color">;

const defaultElement = "p";

export const Text = <E extends ElementType = typeof defaultElement>({
  as,
  children,
  className,
  color,
  size,
  weight,
  ...rest
}: TextProps<E>) => {
  const Element = as || defaultElement;

  const textClassName = text({
    color,
    size,
    weight,
  });

  return (
    <Element className={`${textClassName} ${className || ""}`} {...rest}>
      {children}
    </Element>
  );
};

Text.displayName = "Text";
