"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2, ExternalLink, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

interface Source {
  source_table: string;
  title: string;
  link: string | null;
  similarity: number;
}

export default function ChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingQueryRef = useRef<string | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      // Process any pending query from external trigger
      if (pendingQueryRef.current) {
        const query = pendingQueryRef.current;
        pendingQueryRef.current = null;
        handleSend(query);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Listen for custom events from Hero search / other AI search buttons
  useEffect(() => {
    const handler = (e: Event) => {
      const query = (e as CustomEvent).detail;
      if (query && typeof query === "string" && query.trim()) {
        if (isOpen) {
          handleSend(query.trim());
        } else {
          pendingQueryRef.current = query.trim();
          setIsOpen(true);
        }
      }
    };
    window.addEventListener("willstone-ai-search", handler);
    return () => window.removeEventListener("willstone-ai-search", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isLoading]);

  async function handleSend(overrideMessage?: string) {
    const messageText = overrideMessage || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();

      if (res.ok) {
        // Deduplicate sources by link
        const seen = new Set<string>();
        const uniqueSources = (data.sources || []).filter((s: Source) => {
          const key = s.link || s.title;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
            sources: uniqueSources.slice(0, 4),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I couldn't connect to the server. Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Enhanced markdown-like formatting
  function formatMessage(text: string) {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      let processed = line;

      // 1. Bold: **text**
      processed = processed.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-black">$1</strong>'
      );

      // 2. Links: [text](url)
      processed = processed.replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--brand-medium)] underline font-bold hover:opacity-80 transition-opacity">$1</a>'
      );

      // 3. Headers: ### Heading
      if (processed.startsWith("### ")) {
        return (
          <h3
            key={i}
            className="text-sm font-display font-bold text-[var(--brand-medium)] mt-3 mb-1 uppercase tracking-wide"
            dangerouslySetInnerHTML={{ __html: processed.slice(4) }}
          />
        );
      }

      // 4. Numbered Lists: 1. Item
      const numberedMatch = processed.match(/^(\d+)\.\s(.*)/);
      if (numberedMatch) {
        return (
          <div key={i} className="flex gap-2 my-1 pl-1">
            <span className="font-bold text-[var(--brand-medium)] shrink-0">
              {numberedMatch[1]}.
            </span>
            <div
              className="text-[13px]"
              dangerouslySetInnerHTML={{ __html: numberedMatch[2] }}
            />
          </div>
        );
      }

      // 5. Bullet points: - Item or * Item
      if (processed.startsWith("- ") || processed.startsWith("* ")) {
        return (
          <div key={i} className="flex gap-2 my-1 pl-2 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-medium)] shrink-0 mt-1.5" />
            <div
              className="text-[13px]"
              dangerouslySetInnerHTML={{ __html: processed.slice(2) }}
            />
          </div>
        );
      }

      // 6. Manual Line Breaks
      if (processed.trim() === "") return <div key={i} className="h-2" />;

      return (
        <div
          key={i}
          className="my-0.5 text-[13px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processed }}
        />
      );
    });
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full bg-[var(--brand-medium)] hover:bg-[var(--brand-dark)] text-[#f5f0eb] shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] flex items-center justify-center cursor-pointer transition-colors duration-300 group"
            aria-label="Open AI Chat"
            id="chat-agent-trigger"
          >
            <Sparkles
              size={24}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-[200] w-[420px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-48px)] flex flex-col rounded-3xl overflow-hidden shadow-[0_24px_80px_-12px_rgba(0,0,0,0.25)] border border-[var(--brand-medium)]/10"
          >
            {/* Header */}
            <div className="bg-[var(--brand-medium)] px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-display text-base tracking-wide leading-none">
                    Willstone AI
                  </h3>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">
                    Community Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-[#f5f0eb] px-4 py-4 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[var(--brand-medium)]/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* Welcome message */}
              {messages.length === 0 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center px-6"
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--brand-medium)]/10 flex items-center justify-center mb-4">
                    <Sparkles
                      size={28}
                      className="text-[var(--brand-medium)]"
                    />
                  </div>
                  <h4 className="font-display text-[var(--brand-medium)] text-xl mb-2">
                    How can I help?
                  </h4>
                  <p className="text-[var(--brand-medium)]/60 text-sm leading-relaxed max-w-[280px]">
                    Ask me about community resources, events, guides, news, or
                    government officials in Willstone.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {[
                      "What events are coming up?",
                      "Where is the city library?",
                      "Who is the mayor?",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="px-3 py-1.5 rounded-full bg-white border border-[var(--brand-medium)]/10 text-[var(--brand-medium)] text-xs font-bold hover:bg-[var(--brand-medium)] hover:text-white transition-all cursor-pointer shadow-sm"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-[var(--brand-medium)] flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={14} className="text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] ${msg.role === "user"
                        ? "bg-[var(--brand-medium)] text-white rounded-2xl rounded-br-md px-4 py-3"
                        : "bg-white text-[#1c2b2b] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-[var(--brand-medium)]/5"
                      }`}
                  >
                    <div className="text-[13px] leading-relaxed font-medium">
                      {msg.role === "assistant"
                        ? formatMessage(msg.content)
                        : msg.content}
                    </div>

                    {/* Source Citations */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[var(--brand-medium)]/10">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--brand-medium)]/50 mb-1.5">
                          Sources
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((src, j) => (
                            <a
                              key={j}
                              href={src.link || "#"}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--brand-medium)]/5 hover:bg-[var(--brand-medium)]/10 rounded-md text-[10px] font-bold text-[var(--brand-medium)] transition-colors"
                            >
                              {src.title}
                              {src.link && <ExternalLink size={8} />}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-[var(--brand-dark)] flex items-center justify-center shrink-0 mt-0.5">
                      <User size={14} className="text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-[var(--brand-medium)] flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-[var(--brand-medium)]/5">
                    <div className="flex items-center gap-2 text-[var(--brand-medium)]/60">
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                      <span className="text-xs font-bold">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-[var(--brand-medium)]/10 px-4 py-3 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Willstone..."
                  disabled={isLoading}
                  className="flex-1 bg-[#f5f0eb] border border-[var(--brand-medium)]/10 rounded-xl px-4 py-2.5 text-sm text-[#1c2b2b] placeholder:text-[#1c2b2b]/40 focus:outline-none focus:border-[var(--brand-medium)]/30 focus:ring-2 focus:ring-[var(--brand-medium)]/10 transition-all disabled:opacity-50 font-medium"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-[var(--brand-medium)] hover:bg-[var(--brand-dark)] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
