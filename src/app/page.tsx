import React from "react";
import ChatInterface from "./ChatInterface";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-4 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-4xl mx-auto">
        <ChatInterface />
      </div>
    </div>
  );
}
