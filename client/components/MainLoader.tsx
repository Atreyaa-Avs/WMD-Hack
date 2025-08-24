"use client";

import React, { useEffect, useState } from "react";
import { NumberTicker } from "./magicui/number-ticker";
import { Ripple } from "./magicui/ripple";
import { motion } from "motion/react";
import { ChartNoAxesCombined } from "lucide-react";

const MainLoader = () => {
  const [hideNow, setHideNow] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Lock scroll while loader is visible
  useEffect(() => {
    document.body.style.overflow = hidden ? "auto" : "hidden";
  }, [hidden]);

  // Unmount loader after animation completes
  if (hidden) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-white"
      initial={{ y: 0 }}
      animate={{ y: hideNow ? "-100%" : 0 }}
      transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
      onAnimationComplete={() => hideNow && setHidden(true)}
    >
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col justify-center items-center z-10 text-center text-gray-700">
          <ChartNoAxesCombined size={80} />
          <span className="text-base mt-2 pl-2">Loading...</span>
        </div>
        <Ripple mainCircleSize={200} numCircles={6}/>
      </div>

      <NumberTicker
        className="absolute right-12 bottom-0 font-bold xl:text-9xl 2xl:text-[10rem] tracking-wide"
        value={100}
        setHideNow={setHideNow}
      />
    </motion.div>
  );
};

export default MainLoader;
