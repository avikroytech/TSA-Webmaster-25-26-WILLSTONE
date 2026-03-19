"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  ExternalLink,
  Bot,
  User,
  ChevronRight,
  Pencil,
  ShieldCheck,
  ArrowUp,
  Search
} from "lucide-react";

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
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pendingQueryRef = useRef<string | null>(null);

  // Constants
  const PANEL_WIDTH = 400;

  // Load from sessionStorage on mount
  useEffect(() => {
    const savedMessages = sessionStorage.getItem("willstone-chat-messages");
    const savedIsOpen = sessionStorage.getItem("willstone-chat-open");

    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    }

    if (savedIsOpen === "true") {
      setIsOpen(true);
      // Synchronize layout on mount
      updateLayout(true);
    }
    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Synchronize layout with isOpen state
  function updateLayout(open: boolean) {
    if (typeof window === 'undefined') return;
    const wrapper = document.getElementById('main-content-wrapper');
    if (wrapper) {
      if (open && window.innerWidth >= 768) {
        wrapper.style.marginRight = `${PANEL_WIDTH}px`;
      } else {
        wrapper.style.marginRight = '0px';
      }
    }
  }

  // Handle window resizing to keep layout in sync
  useEffect(() => {
    const handleResize = () => {
      if (isInitialized) updateLayout(isOpen);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, isInitialized]);

  // Save to sessionStorage whenever state changes
  useEffect(() => {
    if (!isInitialized) return;
    sessionStorage.setItem("willstone-chat-messages", JSON.stringify(messages));
    sessionStorage.setItem("willstone-chat-open", String(isOpen));
    updateLayout(isOpen);
  }, [messages, isOpen, isInitialized]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-expand input height
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      const newHeight = Math.min(inputRef.current.scrollHeight, window.innerHeight * 0.15);
      inputRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      if (pendingQueryRef.current) {
        const query = pendingQueryRef.current;
        pendingQueryRef.current = null;
        handleSend(query);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Listen for custom events
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
            content: "I ran into a bit of trouble finding that information. Could you try rephrasing?",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I couldn't reach the Willstone knowledge base. Please check your connection.",
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

  function formatMessage(text: string) {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      let processed = line;
      processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[var(--brand-dark)]">$1</strong>');
      processed = processed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--brand-medium)] underline font-bold hover:opacity-80 transition-opacity">$1</a>');

      if (processed.startsWith("### ")) {
        return (
          <h3 key={i} className="text-sm font-display font-bold text-[var(--brand-dark)] mt-3 mb-1 uppercase tracking-wide">
            {processed.slice(4)}
          </h3>
        );
      }

      const numberedMatch = processed.match(/^(\d+)\.\s(.*)/);
      if (numberedMatch) {
        return (
          <div key={i} className="flex gap-2 my-1 pl-1">
            <span className="font-bold text-[var(--brand-medium)] shrink-0">{numberedMatch[1]}.</span>
            <div className="text-[13px] text-[#2c3e3e]" dangerouslySetInnerHTML={{ __html: numberedMatch[2] }} />
          </div>
        );
      }

      if (processed.startsWith("- ") || processed.startsWith("* ")) {
        return (
          <div key={i} className="flex gap-2 my-1 pl-2 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-medium)]/40 shrink-0 mt-1.5" />
            <div className="text-[13px] text-[#2c3e3e]" dangerouslySetInnerHTML={{ __html: processed.slice(2) }} />
          </div>
        );
      }

      if (processed.trim() === "") return <div key={i} className="h-2" />;

      return (
        <div key={i} className="my-0.5 text-[13px] leading-relaxed text-[#2c3e3e]" dangerouslySetInnerHTML={{ __html: processed }} />
      );
    });
  }

  return (
    <>
      {/* Top Right Universal Toggle */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed top-4 right-4 z-[90] flex items-center gap-3 px-5 py-3 bg-[#496A49] text-[#f5f0eb] rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C59F82] group"
          >
            <Sparkles size={20} className="shrink-0" />
            <span className="font-bold uppercase tracking-[0.15em] text-sm">Beacon</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Side Panel */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[300] h-full shadow-[-20px_0_60px_rgba(0,0,0,0.1)] flex flex-col pointer-events-auto w-full md:w-[400px]"
          >
            {/* Main Panel Background with Rounded Corner */}
            <div className="absolute inset-0 bg-[#F9F7F2] md:rounded-tl-[40px] md:border-l border-[var(--brand-medium)]/5 shadow-inner" />

            {/* Panel Content Wrapper */}
            <div className="relative flex flex-col h-full">

              {/* Header */}
              <div className="flex items-center justify-between px-8 pt-10 pb-6 relative z-10">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--brand-medium)]/5 text-[var(--brand-medium)] hover:bg-[var(--brand-medium)]/10 transition-all group"
                >
                  <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">Close Chat</span>
                </button>
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-2xl text-[var(--brand-dark)] tracking-tight">Beacon</h2>
                  <div className="w-10 h-10 rounded-full border-2 border-[var(--brand-medium)]/20 flex items-center justify-center bg-white shadow-sm overflow-hidden text-[var(--brand-medium)]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M11 11.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5-.5.2-.5.5.2.5.5.5z" />
                      <path d="M12 11.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5-.5.2-.5.5.2.5.5.5z" />
                      <path d="M13 11.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5-.5.2-.5.5.2.5.5.5z" />
                      <path d="M9.5 15.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5-.5.2-.5.5.2.5.5.5z" />
                      <path d="M10.5 15.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5-.5.2-.5.5.2.5.5.5z" />
                      <path d="M11.5 15.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5-.5.2-.5.5.2.5.5.5z" />
                      <path d="M12.5 15.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5-.5.2-.5.5.2.5.5.5z" />
                      <path d="M13.5 15.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5-.5.2-.5.5.2.5.5.5z" />
                      <path d="M14.5 15.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5-.5.2-.5.5.2.5.5.5z" />
                      <path d="M12 2v2" />
                      <path d="M12 22v-3" />
                      <path d="M16 22H8" />
                      <path d="M15 19l-1-12.2c0-.4-.3-.8-.7-.8h-2.6c-.4 0-.7.4-.7.8L9 19" />
                      <path d="M10 7h4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Chat Scroll Area */}
              <div
                className="flex-1 overflow-y-auto px-8 py-4 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[var(--brand-medium)]/10 [&::-webkit-scrollbar-thumb]:rounded-full"
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest("a") && window.innerWidth < 768) {
                    setIsOpen(false);
                  }
                }}
              >
                {/* Initial Suggestion State */}
                {messages.length === 0 && !isLoading && (
                  <div className="space-y-8 mt-4">
                    <div className="flex flex-wrap justify-center gap-2 px-10">
                      {[
                        "What are important events in April?",
                        "Where is the city library?",
                        "Find nonprofits focused on Health & Safety.",
                      ].map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSend(q)}
                          className="px-3 py-1.5 rounded-full bg-white border border-[var(--brand-medium)]/5 text-[var(--brand-medium)] text-[11px] font-bold hover:bg-[var(--brand-medium)] hover:text-white transition-all shadow-sm"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Loop */}
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[90%] flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      <div className={`px-5 py-4 rounded-[24px] shadow-sm ${msg.role === "user"
                        ? "bg-[var(--brand-medium)] text-white rounded-br-md"
                        : "bg-white text-[#1c2b2b] rounded-bl-md border border-[var(--brand-medium)]/5"
                        }`}>
                        <div className="text-[14px] leading-relaxed">
                          {msg.role === "assistant" ? formatMessage(msg.content) : msg.content}
                        </div>
                      </div>

                      {/* Source Chips */}
                      {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.sources.map((src, j) => (
                            <a
                              key={j}
                              href={src.link || "#"}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[var(--brand-medium)]/10 rounded-full text-[10px] font-bold text-[var(--brand-medium)] hover:bg-[var(--brand-medium)] hover:text-white transition-all shadow-sm"
                            >
                              <Search size={10} />
                              {src.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/80 backdrop-blur-sm px-5 py-4 rounded-[24px] rounded-bl-md border border-[var(--brand-medium)]/5 flex items-center gap-3">
                      <Loader2 size={16} className="animate-spin text-[var(--brand-medium)]" />
                      <span className="text-[13px] font-bold text-[var(--brand-medium)]/60 italic">Thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} className="h-4" />
              </div>

              {/* Input Area */}
              <div className="px-8 pb-10 pt-4">
                <div className="relative flex items-end">
                  <div className="absolute left-4 bottom-3 w-10 h-10 rounded-xl bg-[var(--brand-dark)] flex items-center justify-center text-white z-10">
                    <Sparkles size={18} />
                  </div>
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Beacon..."
                    className="w-full bg-[#EFECE6] border-none rounded-2xl py-5 pl-16 pr-14 text-sm font-medium text-[var(--brand-dark)] placeholder:text-[var(--brand-dark)]/40 focus:ring-2 focus:ring-[var(--brand-medium)]/20 transition-all shadow-inner resize-none min-h-[60px] overflow-y-auto custom-scrollbar"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-4 bottom-3 w-10 h-10 flex items-center justify-center rounded-xl bg-transparent text-[var(--brand-dark)] hover:bg-[var(--brand-medium)]/5 transition-colors disabled:opacity-20 z-10"
                  >
                    <ArrowUp size={20} />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

