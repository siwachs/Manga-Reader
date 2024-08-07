"use client";

import useBodyOverflow from "@/hooks/useBodyOverflow";
import { useState } from "react";
import ReactDom from "react-dom";

import { Bars3 } from "../icons";
import Sidebar from "./sidebar";

const MenuToggler: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useBodyOverflow(sidebarOpen);

  return sidebarOpen ? (
    ReactDom.createPortal(
      <Sidebar setSidebarOpen={setSidebarOpen} />,
      document.getElementById("sidebar-portal") as HTMLElement,
    )
  ) : (
    <button
      onClick={() => setSidebarOpen((prev) => !prev)}
      className="absolute left-5 top-0.5 cursor-pointer text-[var(--app-text-color-medium-gray)] lg:hidden"
    >
      <Bars3 className="h-[25px] w-[25px]" />
    </button>
  );
};

export default MenuToggler;
