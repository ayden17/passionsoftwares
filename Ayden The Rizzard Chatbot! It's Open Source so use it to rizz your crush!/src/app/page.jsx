"use client";
import React from "react";

import { useHandleStreamResponse } from "../utilities/runtime-helpers";

function MainComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: (message) => {
      setMessages((prev) => [...prev, { role: "assistant", content: message }]);
      setStreamingMessage("");
      setIsLoading(false);
    },
  });

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");

    const searchResponse = await fetch(
      `/integrations/google-search/search?q=${encodeURIComponent(
        text + " pick up lines"
      )}`
    );
    const searchData = await searchResponse.json();
    const searchContext = searchData.items
      ?.slice(0, 3)
      .map((item) => item.snippet)
      .join(" ");

    const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are Ayden the Rizzard, a flirty and charming chatbot who specializes in creative pick-up lines. Keep responses fun, lighthearted, and appropriate. Use the search context provided to inspire your responses, but add your own creative twist.",
          },
          {
            role: "user",
            content: `Search context: ${searchContext}\n\nUser message: ${text}\n\nPlease provide a creative and fun pick-up line or flirty response.`,
          },
        ],
        stream: true,
      }),
    });

    handleStreamResponse(response);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-purple-600 to-pink-500 p-4">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-white font-crimson-text">
          Ayden the Rizzard 🪄
        </h1>
        <p className="text-white">Your Personal Pick-up Line Wizard</p>
      </div>

      <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-lg p-4 overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-purple-500 text-white"
                    : "bg-white text-purple-900"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {streamingMessage && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-white text-purple-900">
                {streamingMessage}
              </div>
            </div>
          )}
          {isLoading && !streamingMessage && (
            <div className="flex justify-center">
              <div className="animate-pulse text-white">
                ✨ Crafting magic...
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask for a pick-up line..."
          className="flex-1 rounded-lg p-3 bg-white/20 backdrop-blur-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isLoading}
          className="bg-white text-purple-600 rounded-lg px-6 py-3 font-bold hover:bg-white/90 transition-colors"
        >
          Send
        </button>
      </div>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default MainComponent;