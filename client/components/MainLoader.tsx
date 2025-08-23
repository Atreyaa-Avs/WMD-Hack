"use client";

import React, { useEffect, useState } from "react";
import { NumberTicker } from "./magicui/number-ticker";
import { Ripple } from "./magicui/ripple";
import { motion } from "motion/react";

const MainLoader = () => {
  const [hideNow, setHideNow] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!hidden) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [hidden]);

  return (
    <motion.div
      className={`min-h-screen bg-white ${hidden ? "hidden" : ""}`}
      initial={{ y: 0 }}
      animate={{ y: hideNow ? "-100%" : 0 }}
      transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
      onAnimationComplete={() => {
        if (hideNow) setHidden(true);
      }}
    >
      <div className="flex items-center justify-center h-screen">
        <p className="z-10 whitespace-pre-wrap text-center text-4xl font-medium tracking-tight text-gray-700">
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
