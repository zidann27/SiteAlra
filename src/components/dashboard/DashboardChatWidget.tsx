import { useEffect, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";
import {
  getDefaultProfile,
  loadChatMessages,
  loadProfile,
  newId,
  saveChatMessages,
  type ChatMessage,
} from "../../lib/dashboardStore";
import { sendDashboardChat } from "../../lib/chat";

function formatTime(ts: number): string {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ts));
  } catch {
    return "";
  }
}

export default function DashboardChatWidget() {
  const [profile, setProfile] = useState(getDefaultProfile());

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      const data = await loadProfile();
      if (!alive) return;
      setProfile(data);
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      const stored = await loadChatMessages();
      if (!alive) return;
      setMessages(stored);
      setMessagesLoaded(true);
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!messagesLoaded) return;
    if (messages.length > 0) return;

    const initial: ChatMessage[] = [
      {
        id: newId(),
        role: "assistant",
        content: `Halo! Aku asisten bisnis untuk ${profile.name || "UMKM kamu"}.\n\nTanya apa aja soal ide promo, caption, pricing, SOP harian, atau rencana kerja.`,
        createdAt: Date.now(),
      },
    ];

    setMessages(initial);
    void saveChatMessages(initial);
  }, [messages.length, profile.name, messagesLoaded]);

  useEffect(() => {
    if (!messagesLoaded) return;
    void saveChatMessages(messages);

    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, messagesLoaded]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setInput("");

    const userMsg: ChatMessage = {
      id: newId(),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };

    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg]);

    sendDashboardChat(trimmed, history)
      .then((reply) => {
        const assistantMsg: ChatMessage = {
          id: newId(),
          role: "assistant",
          content: reply,
          createdAt: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      })
      .catch((err) => {
        const rawMessage =
          typeof err?.message === "string"
            ? err.message
            : "error tidak diketahui";

        const isUnavailable =
          rawMessage.includes("UNAVAILABLE") ||
          rawMessage.includes("503") ||
          rawMessage.toLowerCase().includes("high demand") ||
          rawMessage.toLowerCase().includes("service unavailable");

        const pretty =
          rawMessage.includes("Kuota Gemini") ||
          rawMessage.includes("RESOURCE_EXHAUSTED") ||
          rawMessage.includes("Too Many Requests") ||
          rawMessage.includes("Quota")
            ? rawMessage
            : isUnavailable
              ? "Gemini lagi ramai/overload. Coba lagi dalam 10–30 detik."
              : `Gagal chat: ${rawMessage}`;

        const assistantMsg: ChatMessage = {
          id: newId(),
          role: "assistant",
          content: pretty,
          createdAt: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      })
      .finally(() => {
        setSending(false);
      });
  };

  const onSend = () => {
    sendMessage(input);
  };

  return (
    <>
      {open && (
        <div className="fixed z-[120] right-4 top-4 bottom-24 w-[320px] sm:w-[380px] bg-white/95 backdrop-blur rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                <Bot size={18} />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-gray-900 truncate">
                  SIRA
                </div>
                <div className="text-xs text-gray-400 truncate">
                  SiteAlra Intelligent Response Assistant
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-2xl hover:bg-gray-50 text-gray-600 transition-colors"
                aria-label="Close chat"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="p-4 flex-1 min-h-0 flex flex-col">
            <div
              ref={listRef}
              className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-2 space-y-3"
            >
              {messages.map((m) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[85%]">
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] border ${
                          isUser
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-50 text-gray-800 border-gray-100"
                        }`}
                      >
                        {m.content}
                      </div>
                      <div
                        className={`mt-1 text-[11px] ${
                          isUser ? "text-right text-gray-400" : "text-gray-400"
                        }`}
                      >
                        {formatTime(m.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {sending && (
                <div className="flex justify-start">
                  <div className="max-w-[85%]">
                    <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed border bg-gray-50 text-gray-600 border-gray-100">
                      Mengetik...
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3">
              <div className="mb-2 flex flex-wrap justify-start gap-2">
                <button
                  type="button"
                  onClick={() => sendMessage("Apa itu SiteAlra?")}
                  className="px-3 py-1.5 rounded-full bg-white text-gray-700 text-[11px] font-semibold border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 hover:-translate-y-0.5 hover:shadow transition-all"
                >
                  Apa itu SiteAlra?
                </button>
                <button
                  type="button"
                  onClick={() => sendMessage("Berapa biaya?")}
                  className="px-3 py-1.5 rounded-full bg-white text-gray-700 text-[11px] font-semibold border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 hover:-translate-y-0.5 hover:shadow transition-all"
                >
                  Berapa biaya?
                </button>
                <button
                  type="button"
                  onClick={() => sendMessage("Butuh coding?")}
                  className="px-3 py-1.5 rounded-full bg-white text-gray-700 text-[11px] font-semibold border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 hover:-translate-y-0.5 hover:shadow transition-all"
                >
                  Butuh coding?
                </button>
              </div>
              <div className="flex items-center gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSend();
                    }
                  }}
                  placeholder="Tanya tentang promo, stok, pricing, SOP..."
                  rows={2}
                  className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 placeholder-gray-400 text-sm resize-none"
                />

                <button
                  type="button"
                  onClick={onSend}
                  disabled={!input.trim() || sending}
                  className="inline-flex items-center justify-center gap-2 h-12 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-2xl transition-colors text-sm"
                  title="Kirim"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed z-[120] right-4 bottom-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-14 h-14 rounded-3xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center transition-colors"
          aria-label={open ? "Close chatbot" : "Open chatbot"}
          title={open ? "Tutup Chatbot" : "Buka Chatbot"}
        >
          <Bot size={20} />
        </button>
      </div>
    </>
  );
}
