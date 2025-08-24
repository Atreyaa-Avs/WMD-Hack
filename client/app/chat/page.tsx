"use client";

import ChangeUserModal from "@/components/ChatComponents/ChangeUserModal";
import ChatLayout from "@/components/ChatComponents/ChatLayout";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/store/useProfile";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();

  const { profile } = useProfile();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex justify-between items-center w-full py-4 px-3 border-b-[3px]">
        <Button onClick={() => router.back()} className="cursor-pointer">
          <ArrowLeft />
          Go Back
        </Button>

        <h1 className="font-bold text-2xl">Chat: User {profile}</h1>

        <div className="flex items-center gap-4">
          <ChangeUserModal />
          <AnimatedThemeToggler />
        </div>
      </div>

      <div className="flex-1">
        <ChatLayout />
      </div>
    </div>
  );
};

export default page;
