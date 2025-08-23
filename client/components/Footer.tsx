import React from "react";
import { TextHoverEffect } from "./ui/text-hover-effect";

const Footer = () => {
  return (
    <div className="flex flex-col dark:bg-black">
      <div className="flex items-center justify-center">
        <TextHoverEffect text="FinSmart" textSize={"text-5xl"} duration={0.5} />
      </div>
      <div className="self-end w-full mb-3">
        <div className="flex justify-between bg-neutral-300 rounded-xl mx-6 p-6">
          <div>
            <h1 className="font-medium text-xl dark:text-black">FinSmart</h1>
          </div>
          <div>
            <p className="text-neutral-500 text-lg pl-48 dark:text-black">
              &copy; FinSmart. All Rights Reserved.
            </p>
          </div>
          <div>
            <p className="font-medium text-xl dark:text-black">Made with ❤️ in India</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
