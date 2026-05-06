import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";
import {
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
  const profile = useMemo(() => loadProfile(), []);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadChatMessages(),
  );
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages.length === 0) return;
    const first = messages[0];
    if (
      first?.role === "assistant" &&
      typeof first.content === "string" &&
      first.content.toLowerCase().includes("belum tersambung")
    ) {
      const updated: ChatMessage[] = [
        {
          ...first,
          content: `Halo! Aku asisten bisnis untuk ${profile.name || "UMKM kamu"}.\n\nTanya apa aja soal ide promo, caption, pricing, SOP harian, atau rencana kerja.`,
        },
        ...messages.slice(1),
      ];
      setMessages(updated);
    }
    // Only run on mount to migrate old stored message.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
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
    saveChatMessages(initial);
  }, [messages.length, profile.name]);

  useEffect(() => {
    saveChatMessages(messages);

    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const onSend = () => {
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setInput("");

    const userMsg: ChatMessage = {
      id: newId(),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };

    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg]);

    sendDashboardChat(text, history)
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
                  Asisten UMKM
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {profile.name ? profile.name : "Profil belum diisi"}
                </div>
              </div>
            </div>

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
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere] border ${
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
              <div className="flex items-end gap-2">
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
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-2xl transition-colors text-sm"
                  title="Kirim"
                >
                  <Send size={16} />
                </button>
              </div>

              <div className="mt-2 text-xs text-gray-400">
                Enter kirim, Shift+Enter baris baru.
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
