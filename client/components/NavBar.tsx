import { ChartNoAxesCombined } from "lucide-react";
import React from "react";
import { AnimatedThemeToggler } from "./magicui/animated-theme-toggler";

const NavBar = () => {
  return (
    <nav
      className="fixed bg-white dark:bg-black w-[80%] top-4 left-1/2 transform -translate-x-1/2 border border-[#ccc] px-4 rounded-2xl py-2 z-10"
      style={{
        boxShadow: "var(--shadow-acternity)",
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <ChartNoAxesCombined />
          <h1 className="text-3xl dark:text-white font-bold">FinSmart.</h1>
        </div>
        <div className="mt-2">
          <AnimatedThemeToggler />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
