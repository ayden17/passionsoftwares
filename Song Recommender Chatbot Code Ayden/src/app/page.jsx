"use client";
import React from "react";

import { useHandleStreamResponse } from "../utilities/runtime-helpers";

function MainComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");

  const handleFinish = useCallback((message) => {
    setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    setStreamingMessage("");
    setLoading(false);
  }, []);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: handleFinish,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const systemMessage = {
      role: "system",
      content:
        "You are a music recommendation expert. Based on the user input, suggest 3 songs and include a brief explanation why. Be friendly and conversational.",
    };

    try {
      const chatResponse = await fetch(
        "/integrations/chat-gpt/conversationgpt4",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [systemMessage, ...messages, userMessage],
            stream: true,
          }),
        }
      );
      handleStreamResponse(chatResponse);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] p-4">
      <div className="flex-1 overflow-auto mb-4 bg-white rounded-lg shadow-sm p-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-4 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-[#007AFF] text-white"
                  : "bg-[#F0F0F0] text-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {streamingMessage && (
          <div className="text-left">
            <div className="inline-block p-3 rounded-lg bg-[#F0F0F0] text-black">
              {streamingMessage}
            </div>
          </div>
        )}
        {loading && !streamingMessage && (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce mx-1"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce mx-1"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce mx-1"></div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell me about your music taste..."
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#007AFF]"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#007AFF] text-white px-6 py-3 rounded-lg hover:bg-[#0056b3] disabled:opacity-50"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}

export default MainComponent;