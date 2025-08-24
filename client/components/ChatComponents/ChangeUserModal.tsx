"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircleX } from "lucide-react";
import ModalContent from "./ModalContent";
import { useState } from "react";

export default function ChangeUserModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer dark:bg-neutral-200 dark:hover:bg-neutral-300 dark:text-black"
        >
          Change Current User
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg md:max-w-xl xl:max-w-4xl 2xl:max-w-6xl [&>button:last-child]:hidden dark:bg-gray-800">
        <div className="overflow-y-auto">
          <DialogHeader className="contents space-y-0 text-left">
            <div className="flex justify-between items-end py-6">
              <DialogTitle className="px-6">Change User</DialogTitle>
              <DialogTrigger asChild className="pr-4 mr-10">
                <Button
                  variant="outline"
                  className="text-red-500 hover:text-red-700"
                >
                  <CircleX size={40}/>
                </Button>
              </DialogTrigger>
            </div>
          </DialogHeader>
          <ModalContent />
          <DialogFooter className="px-6 pb-6 sm:justify-center">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
