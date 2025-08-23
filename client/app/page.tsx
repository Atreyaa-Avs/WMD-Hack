import Hero from "@/components/Hero";
import { NumberTicker } from "@/components/magicui/number-ticker";
import MainLoader from "@/components/MainLoader";
import NavBar from "@/components/NavBar";
import React from "react";

const page = () => {
  return (
    <div className="min-h-[300vh] bg-neutral-100">
      <div className="absolute inset-0 z-50">
        <MainLoader />
      </div>
      <div
        className="bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/Backgrounds/Main_Bg.jpg')" }}
      >
        <NavBar />
        <Hero />
      </div>
    </div>
  );
};

export default page;
