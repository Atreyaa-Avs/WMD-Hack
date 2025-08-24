import React from "react";
import { Check, ChevronDownIcon, PhoneCall } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";

import Users from "./User.json";
import { Button } from "../ui/button";
import { useProfile } from "@/store/useProfile";
import { DialogClose } from "../ui/dialog";

const items = [
  {
    id: "1",
    title: "User 1",
    sub: "1111111111",
    content:
      "Connect your accounts from Google, GitHub, or Microsoft to enable single sign-on and streamline your workflow. Connected accounts can be used for quick login and importing your preferences across platforms. You can revoke access to any connected account at any time.",
  },
  {
    id: "2",
    title: "User 2",
    sub: "Customize your notification preferences",
    content:
      "Choose which updates you want to receive. You can get notifications for: security alerts, billing updates, newsletter and product announcements, usage reports, and scheduled maintenance. Notifications can be delivered via email, SMS, or push notifications on your devices.",
  },
  {
    id: "3",
    title: "2-step verification",
    sub: "Add an extra layer of security to your account",
    content:
      "Protect your account with two-factor authentication. You can use authenticator apps like Google Authenticator or Authy, receive SMS codes, or use security keys like YubiKey. We recommend using an authenticator app for the most secure experience.",
  },
  {
    id: "4",
    title: "Contact support",
    sub: "We're here to help 24/7",
    content:
      "Our support team is available around the ClockIcon to assist you. For billing inquiries, technical issues, or general questions, you can reach us through live chat, email at support@example.com, or schedule a call with our technical team. Premium support is available for enterprise customers.",
  },
];

const ModalContent = () => {
  const { profile, setProfile, setPhone } = useProfile();
  return (
    <div className="mx-6">
      <Accordion type="single" collapsible className="w-full" defaultValue="3">
        {Users.map((item, index) => (
          <AccordionItem
            value={item.id}
            key={item.id}
            className={`py-2 px-4 rounded-sm ${
              profile === item.id && "bg-green-300"
            }`}
          >
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] [&[data-state=open]>svg]:rotate-180">
                <span className="flex flex-col space-y-1">
                  <span className="text-xl">{item.title}</span>
                  <span className="flex items-center gap-1">
                    <PhoneCall size={18} />:
                    {item.sub && (
                      <span className="text-sm font-normal">{item.sub}</span>
                    )}
                  </span>
                </span>
                <div className="flex gap-4 items-center">
                  {/* Check button */}
                  <DialogClose asChild>
                    <Button
                      className={`bg-gray-200 border-[3px] hover:bg-gray-300 ${
                        profile === item.title
                          ? "border-green-500"
                          : "border-[#ccc]"
                      }`}
                      onClick={() => {
                        setProfile(item.id);
                        setPhone(item.sub);
                      }}
                    >
                      <Check
                        size={34}
                        className={`pointer-events-none shrink-0 transition-transform duration-200 ${
                          profile === item.title
                            ? "text-green-500 opacity-100"
                            : "text-gray-400 opacity-60"
                        }`}
                      />
                    </Button>
                  </DialogClose>
                  <ChevronDownIcon
                    size={16}
                    className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </div>
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="text-black font-medium text-xl pb-2">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ModalContent;
