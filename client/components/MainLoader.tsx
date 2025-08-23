"use client";

import React, { useEffect, useState } from "react";
import { NumberTicker } from "./magicui/number-ticker";
import { Ripple } from "./magicui/ripple";
import { motion } from "motion/react";

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
        <p className="z-10 text-center text-4xl font-medium tracking-tight text-gray-700">
          Loading...
        </p>
        <Ripple mainCircleSize={250} />
      </div>

      <NumberTicker
        className="absolute right-12 bottom-0 font-bold text-[10rem] tracking-tighter"
        value={100}
        setHideNow={setHideNow}
      />
    </motion.div>
  );
};

export default MainLoader;