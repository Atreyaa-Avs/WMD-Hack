"use client";

import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import StatusChecker from "../StatusChecker";

export default function ChatLayout() {
  return (
    <div className="h-full w-full">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={50} className="h-full">
          <div className="h-full p-4 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-xl text-center font-bold border-b-[3px] border-black pb-4">
              Financial Data
            </h1>
            <h2>Hello</h2>
            <StatusChecker />
          </div>
        </Panel>

        <PanelResizeHandle>
          <div className="w-1 bg-gray-400 hover:bg-gray-600 cursor-col-resize h-full" />
        </PanelResizeHandle>

        <Panel className="h-full">
          <div className="h-full p-4 bg-gray-200 dark:bg-gray-900">
            <h1 className="text-xl text-center font-bold border-b-[3px] border-black pb-4">
              Chatbot
            </h1>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
