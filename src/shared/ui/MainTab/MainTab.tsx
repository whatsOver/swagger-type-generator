import React from "react";
import { MainTabItem } from "./core/MainTabItem";
import { mainTab } from "./mainTab.css";

type Props = {
  className?: string;
  top?: boolean;
  children?: React.ReactNode;
};

export const MainTab = ({ top, children }: Props) => (
  <div className={mainTab({ position: top ? "top" : "bottom" })}>
    {children}
  </div>
);

MainTab.displayName = "MainTab";
MainTab.Item = MainTabItem;
