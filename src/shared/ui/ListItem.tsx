import classNames from "classnames";
import React from "react";
import { listItemStyles } from "./styles/listItem.css";
import { vars } from "./styles/theme.css";

export interface ListItemProps {
  children: React.ReactNode;
  height?: number;
  withPadding?: boolean;
  withBorder?: boolean;
  onClick?: () => void;
}

const ListItem = ({
  children,
  onClick,
  height = 52,
  withPadding = false,
  withBorder = false,
}: ListItemProps) => {
  return (
    <div
      onClick={onClick}
      className={listItemStyles.itemWrapper}
      style={{
        display: "flex",
        height: "auto",
        padding: withPadding ? "0.7rem 1rem" : 0,
        borderBottom: withBorder ? `0.2px solid ${vars.color.grey}` : "none",
      }}
    >
      {children}
    </div>
  );
};

type LeftProps = {
  left?: React.ReactNode;
  middle?: React.ReactNode;
  right?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const Left = ({ left, middle, right, ...rest }: LeftProps) => {
  return (
    <div
      {...rest}
      className={classNames(listItemStyles.leftWrapper, rest.className)}
    >
      {left}
      {middle}
      {right}
    </div>
  );
};

type RightProps = {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const Right = ({ children, ...rest }: RightProps) => {
  return (
    <div
      {...rest}
      className={classNames(listItemStyles.rightWrapper, rest.className)}
    >
      {children}
    </div>
  );
};

ListItem.Left = Left;
ListItem.Right = Right;

export default ListItem;
