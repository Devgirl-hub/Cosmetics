/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Send, X, MessageSquare, Sparkles, CornerDownLeft } from "lucide-react";
import { ChatMessage } from "../types";

interface BeautyChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BeautyChat({ isOpen, onClose }: BeautyChatProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      role: "model",
      text: "Bonjour! I am your AURA Beauty Expert. I can assist you with building skincare routines, selecting lipstick shades, understanding active botanicals, or finding the perfect gift. What beauty query is on your mind today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!isOpen) return null;

  const quickQuestions = [
    "What is Niacinamide good for?",
    "Best routine for Dry Skin",
    "How to try Sunset Coral Lip Cream?",
    "Vegan cosmetics list"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      // Map history for API
      const prevHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: prevHistory
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setMessages(prev => [
          ...prev,
          {
            id: `msg-${Date.now()}-ai`,
            role: "model",
            text: data.text,
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error(data.error || "Unable to reach AURA expert");
      }
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-error`,
          role: "model",
          text: "Forgive me, my connection to the botanical lab seems weak at the moment. Please double check that your server is starting successfully under Secrets configs.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  return (
    <div id="beauty-chat-container" className="fixed bottom-20 right-4 sm:right-6 z-40 w-full max-w-[360px] sm:max-w-[400px] bg-white rounded-2xl border border-stone-150 shadow-2xl overflow-hidden flex flex-col h-[520px] animate-slide-up">
      {/* Chat header banner */}
      <div id="chat-header" className="bg-stone-900 px-5 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="rounded-full bg-stone-800 p-1.5 flex items-center justify-center border border-stone-700">
            <MessageSquare className="h-4.5 w-4.5 text-rose-400 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-medium tracking-wide">AURA Beauty Expert</h3>
            <span className="text-[9px] font-mono tracking-wider text-rose-300 uppercase flex items-center gap-1 leading-none mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Botanical Assistant
            </span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="rounded-full bg-stone-800 hover:bg-stone-750 p-1 text-stone-300 transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages scrolling compartment */}
      <div ref={scrollRef} id="chat-log-box" className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
        {messages.map((msg, i) => {
          const isAI = msg.role === "model";
          return (
            <div 
              key={msg.id} 
              className={`flex ${isAI ? 'justify-start' : 'justify-end'} animate-fade-in`}
            >
              <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs tracking-wide leading-relaxed ${
                isAI 
                  ? 'bg-white text-stone-800 border border-stone-150/60 shadow-xs rounded-tl-none' 
                  : 'bg-stone-900 text-white rounded-tr-none'
              }`}>
                {/* Parse simple markdown inside bot response */}
                {isAI ? (
                  <div className="space-y-1">
                    {msg.text.split("\n").map((line, lidx) => {
                      const trimLine = line.trim();
                      if (trimLine.startsWith("-") || trimLine.startsWith("*")) {
                        return (
                          <div key={lidx} className="flex gap-1.5 items-start pl-1">
                            <span>•</span>
                            <span>{trimLine.substring(1).trim()}</span>
                          </div>
                        );
                      }
                      if (trimLine.startsWith("###") || trimLine.startsWith("##")) {
                        return <h4 key={lidx} className="font-bold text-[11px] uppercase tracking-wide text-stone-900 mt-2">{trimLine.replace(/^###?\s+/, '')}</h4>;
                      }
                      return <p key={lidx} className="font-light">{line}</p>;
                    })}
                  </div>
                ) : (
                  <p>{msg.text}</p>
                )}
                
                <span className={`block text-[9px] mt-1.5 text-right opacity-40 font-mono`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading/Typing Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-tl-none border border-stone-150/60 p-3.5 flex items-center gap-1.5 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-stone-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-stone-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-stone-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts helper pill box */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-stone-100 bg-white flex flex-wrap gap-1.5 justify-center">
          {quickQuestions.map((q) => (
            <button
              key={q}
              id={`quick-chat-${q.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => handleSendMessage(q)}
              className="rounded-full bg-stone-50 border border-stone-150/80 px-2.5 py-1 text-[10px] text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Chat inputs dock */}
      <div className="p-3 border-t border-stone-100 bg-white flex gap-2 items-center">
        <textarea
          rows={1}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Inquire about ingredients, routines..."
          className="flex-1 rounded-xl border border-stone-200 px-3.5 py-2.5 text-xs focus:border-stone-400 focus:outline-none resize-none overflow-hidden max-h-16"
        />
        <button
          id="send-chat-submit"
          onClick={() => handleSendMessage(inputMessage)}
          disabled={!inputMessage.trim() || loading}
          className="rounded-xl bg-stone-950 p-2.5 text-white hover:bg-stone-800 transition disabled:opacity-40"
        >
          <Send className="h-4.5 w-4.5 stroke-[1.5]" />
        </button>
      </div>
    </div>
  );
}
