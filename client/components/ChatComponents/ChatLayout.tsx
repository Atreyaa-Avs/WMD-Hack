"use client";

import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import StatusChecker from "../StatusChecker";
import FinancialData from "./FinancialData";
import Chatbot from "./Chatbot";

export default function ChatLayout() {
  return (
    <div className="h-screen w-screen">
      {" "}
      {/* Ensure the parent has full height */}
      <PanelGroup direction="horizontal">
        <Panel defaultSize={70} className="h-full pb-20">
          <div className="flex flex-col h-full p-4 bg-gray-100 dark:bg-black/80">
            <h1 className="text-xl text-center font-bold border-b-[3px] border-black pb-4">
              Financial Data
            </h1>
            {/* Scrollable container */}
            <div className="flex-1 overflow-auto">
              <StatusChecker />
              <FinancialData />
            </div>
          </div>
        </Panel>

        <PanelResizeHandle>
          <div className="w-1 bg-gray-400 hover:bg-gray-600 cursor-col-resize h-full" />
        </PanelResizeHandle>

        <Panel defaultSize={30} className="h-full">
          <div className="flex flex-col h-full p-4 bg-gray-200 dark:bg-black">
            <h1 className="text-xl text-center font-bold border-b-[3px] border-black pb-4 flex-shrink-0">
              Chatbot
            </h1>

            {/* Chatbot takes full remaining height */}
            <div className="flex-1">
              <Chatbot />
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
