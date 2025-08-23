import React from "react";
import { Safari } from "./magicui/safari";
import { BorderBeam } from "./magicui/border-beam";

const Hero = () => {
  return (
    <div className="flex flex-col min-h-screen z-0 pt-42">
      <h1 className="font-bold text-6xl text-center">
        Your Wealth, decoded. <br />
        Financial Analysis, made simple.
      </h1>
      <h2 className="text-xl text-pretty text-center max-w-3xl mx-auto py-7 font-medium">
        Your finances, decoded — real-time insights and an AI assistant built on
        Fi's MCP server.
      </h2>
      

      <HeroImage />
    </div>
  );
};

export default Hero;

const HeroImage = () => {
  return (
    <div className="relative mx-auto w-fit rounded-2xl overflow-hidden">
      <BorderBeam duration={6} size={400} borderWidth={2} />
      <BorderBeam duration={6} delay={3} size={400} borderWidth={2} />

      <Safari url="http://localhost:3000/" />
    </div>
  );
};
