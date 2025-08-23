"use client";

import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { BorderBeam } from "@/components/magicui/border-beam";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Safari } from "@/components/magicui/safari";
import MainLoader from "@/components/MainLoader";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();

  return (
    <div className="bg-neutral-100">
      <div className="absolute inset-0">
        <MainLoader />
      </div>
      <div
        className="bg-cover bg-center bg-no-repeat bg-[url('/Backgrounds/Main_Bg.jpg')] 
             dark:bg-[url('/Backgrounds/Main_Dark_Bg.jpg')]"
      >
        <NavBar />
        <Hero />
        <div className="flex mb-5">
          <Button
            className="relative mx-auto py-5 overflow-hidden hover:cursor-pointer"
            size="lg"
            variant="outline"
            onClick={() => router.push("/chat")}
          >
            <SquareArrowOutUpRight />
            Go to Chat
            <BorderBeam
              size={40}
              initialOffset={20}
              className="from-transparent via-yellow-500 to-transparent"
              transition={{
                type: "spring",
                stiffness: 60,
                damping: 20,
              }}
            />
          </Button>
        </div>
        <HeroImage />
      </div>
      <Footer />
    </div>
  );
};

export default page;

const HeroImage = () => {
  return (
    <div className="relative mx-auto w-fit rounded-2xl overflow-hidden sm:scale-75 md:scale-90 xl:scale-100">
      <BorderBeam duration={6} size={400} borderWidth={2} />
      <BorderBeam duration={6} delay={3} size={400} borderWidth={2} />

      <Safari
        url="http://localhost:3000/"
        className="size-full"
        imageSrc="/Backgrounds/HeroImage_Bg.png"
      />
    </div>
  );
};
