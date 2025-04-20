import React from "react";
import { NavLink } from "react-router-dom";

import { mainTabItem } from "./MinTabItem.css";

type HTMLTagProps = Omit<
  React.HTMLProps<HTMLElement>,
  "type" | "ref" | "className"
>;
type BaseProps = {
  to?: string;
  on?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
};

type Props = HTMLTagProps & BaseProps & { disabled?: boolean };

export const MainTabItem = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  Props
>(({ to, on, children, onClick, disabled, ...props }, ref) => {
  const handleDisableLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  if (to) {
    return (
      <NavLink
        {...props}
        ref={ref as React.Ref<HTMLAnchorElement>}
        aria-disabled={disabled ? true : undefined}
        className={({ isActive }) =>
          mainTabItem({
            state: isActive || on ? "on" : undefined,
          })
        }
        to={disabled ? "#" : to}
        onClick={disabled ? handleDisableLink : onClick}
      >
        {children}
      </NavLink>
    );
  }

  return (
    <button
      {...props}
      ref={ref as React.Ref<HTMLButtonElement>}
      className={mainTabItem({
        state: on ? "on" : undefined,
      })}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
});

MainTabItem.displayName = "MainTabItem";
