import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, X, Plus } from "lucide-react";
import {
  getDefaultProfile,
  loadChatThreads,
  loadChatThreadMessages,
  loadLegacyChatMessages,
  loadLegacyChatThreads,
  clearLegacyChatThreads,
  loadProfile,
  newId,
  saveChatThreadMessages,
  createChatThread,
  setActiveChatThreadId,
  type ChatMessage,
  type ChatThread,
} from "../../lib/dashboardStore";
import { sendDashboardChat } from "../../lib/chat";
import { fetchSessionUser, getSessionUser } from "../../lib/auth";

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

function deriveTitleFromMessages(messages: ChatMessage[]): string {
  const userMsg = messages.find((m) => m.role === "user" && m.content.trim());
  if (!userMsg) return "Chat";
  const base = userMsg.content.replace(/\s+/g, " ").trim();
  if (!base) return "Chat";
  return base.length > 50 ? `${base.slice(0, 50)}...` : base;
}

function buildGreeting(name?: string): ChatMessage[] {
  return [
    {
      id: newId(),
      role: "assistant",
      content: `Halo! Aku asisten bisnis untuk ${name || "UMKM kamu"}.\n\nChat baru sudah dimulai. Tanyakan apa saja!`,
      createdAt: Date.now(),
    },
  ];
}

function filterVisibleThreads(threads: ChatThread[]): ChatThread[] {
  return threads.filter((t) => {
    if (typeof t.messageCount !== "number") return true;
    if (t.messageCount > 1) return true;
    return !(t.title || "").startsWith("Chat ");
  });
}

export default function DashboardChatWidget() {
  const [sessionUser, setSessionUser] = useState(() => getSessionUser());
  const userKey = useMemo(
    () => sessionUser?.id || sessionUser?.email || "anon",
    [sessionUser?.id, sessionUser?.email],
  );

  const [profile, setProfile] = useState(getDefaultProfile());

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadIdState] = useState<string>("");
  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadedUserKey, setLoadedUserKey] = useState(userKey);

  const dirtyRef = useRef(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchSessionUser().then((u) => setSessionUser(u));
  }, []);

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
      const startNewRequested =
        sessionStorage.getItem("sitealra_chat_start_new") === "1";
      const startNew = startNewRequested && userKey !== "anon";
      if (startNew) sessionStorage.removeItem("sitealra_chat_start_new");

      setThreads([]);
      setMessages([]);
      setActiveThreadIdState("");

      const existingThreadsRaw = await loadChatThreads();
      if (!alive) return;

      let finalThreads = filterVisibleThreads(existingThreadsRaw);
      let finalActiveId = "";

      if (!finalThreads.length) {
        const legacyThreads = loadLegacyChatThreads(userKey);
        if (legacyThreads.length) {
          const sortedLegacy = legacyThreads
            .slice()
            .sort(
              (a, b) =>
                (a.updatedAt ?? a.createdAt ?? 0) -
                (b.updatedAt ?? b.createdAt ?? 0),
            );
          const migratedThreads: ChatThread[] = [];
          for (const t of sortedLegacy) {
            const migrated = await createChatThread({
              title: t.title,
              messages: t.messages,
            });
            migratedThreads.push(migrated);
          }
          finalThreads = filterVisibleThreads(migratedThreads);
          finalActiveId = "";
          clearLegacyChatThreads(userKey);
        } else {
          const legacy = loadLegacyChatMessages();
          if (legacy.length) {
            const migrated = await createChatThread({ messages: legacy });
            finalThreads = filterVisibleThreads([migrated]);
            finalActiveId = "";
            localStorage.removeItem("sitealra_chat_messages");
          }
        }
      }

      if (!alive) return;

      setThreads(finalThreads);
      setActiveThreadIdState(finalActiveId);
      if (finalActiveId) setActiveChatThreadId(userKey, finalActiveId);

      const threadMessages = finalActiveId
        ? await loadChatThreadMessages(finalActiveId)
        : buildGreeting(profile.name || undefined);
      if (!alive) return;
      setMessages(threadMessages);
      setLoadedUserKey(userKey);
      setPage(1);
    })();

    return () => {
      alive = false;
    };
  }, [userKey, profile.name]);

  useEffect(() => {
    if (loadedUserKey !== userKey) return;
    if (!activeThreadId) return;

    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;

    if (!dirtyRef.current) return;

    dirtyRef.current = false;
    void (async () => {
      await saveChatThreadMessages(activeThreadId, messages);
      const nextTitle = deriveTitleFromMessages(messages);
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId
            ? {
                ...t,
                updatedAt: Date.now(),
                messageCount: messages.length,
                title:
                  !t.title || t.title === "Chat" || t.title.startsWith("Chat ")
                    ? nextTitle
                    : t.title,
              }
            : t,
        ),
      );
    })();
  }, [messages, activeThreadId, userKey, loadedUserKey]);

  const pageSize = 5;
  const sortedThreads = useMemo(
    () => threads.slice().sort((a, b) => b.updatedAt - a.updatedAt),
    [threads],
  );
  const totalPages = Math.max(1, Math.ceil(sortedThreads.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageThreads = sortedThreads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage);
  }, [page, currentPage]);

  const setActiveThread = async (threadId: string) => {
    if (!threadId) {
      setActiveThreadIdState("");
      setActiveChatThreadId(userKey, "");
      setMessages(buildGreeting(profile.name || undefined));
      return;
    }
    setActiveThreadIdState(threadId);
    setActiveChatThreadId(userKey, threadId);
    const threadMessages = await loadChatThreadMessages(threadId);
    setMessages(threadMessages);
  };

  const onNewChat = () => {
    setActiveThreadIdState("");
    setActiveChatThreadId(userKey, "");
    setMessages(buildGreeting(profile.name || undefined));
  };

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
      .filter((m) => m.role === "user")
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content }));

    if (!activeThreadId) {
      const initial = buildGreeting(profile.name || undefined);
      void (async () => {
        const thread = await createChatThread({
          messages: [...initial, userMsg],
        });
        setThreads((prev) => [thread, ...prev]);
        setActiveThreadIdState(thread.id);
        setActiveChatThreadId(userKey, thread.id);
        setMessages([...initial, userMsg]);
      })();
    } else {
      dirtyRef.current = true;
      setMessages((prev) => [...prev, userMsg]);
    }

    sendDashboardChat(trimmed, history)
      .then((reply) => {
        const assistantMsg: ChatMessage = {
          id: newId(),
          role: "assistant",
          content: reply,
          createdAt: Date.now(),
        };

        dirtyRef.current = true;
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

        dirtyRef.current = true;
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
                onClick={onNewChat}
                className="p-2 rounded-2xl hover:bg-gray-50 text-gray-600 transition-colors"
                aria-label="New chat"
                title="New chat"
              >
                <Plus size={16} />
              </button>
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
            <div className="mb-3">
              <select
                value={activeThreadId}
                onChange={(e) => void setActiveThread(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                aria-label="Pilih chat"
                disabled={pageThreads.length === 0}
              >
                <option value="">New chat</option>
                {pageThreads.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
              {totalPages > 1 && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                          p === currentPage
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        }`}
                        aria-label={`Halaman ${p}`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
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
