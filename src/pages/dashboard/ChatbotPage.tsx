import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, Info } from "lucide-react";
import {
  getDefaultProfile,
  createChatThread,
  getActiveChatThreadId,
  newId,
  loadChatThreads,
  loadProfile,
  saveChatThreads,
  setActiveChatThreadId,
  type ChatThread,
  type ChatMessage,
} from "../../lib/dashboardStore";
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

export default function ChatbotPage() {
  const [sessionUser, setSessionUser] = useState(() => getSessionUser());
  const userKey = useMemo(
    () => sessionUser?.id || sessionUser?.email || "anon",
    [sessionUser?.id, sessionUser?.email],
  );

  const [profile, setProfile] = useState(getDefaultProfile());
  const [threads, setThreads] = useState<ChatThread[]>(() =>
    loadChatThreads(userKey),
  );
  const [activeThreadId, setActiveThreadIdState] = useState<string>(() => {
    const threadsNow = loadChatThreads(userKey);
    return getActiveChatThreadId(userKey) || threadsNow[0]?.id || "";
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadedUserKey, setLoadedUserKey] = useState(userKey);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Sync session user from backend cookie session to avoid stale localStorage.
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
    // Initialize threads + active thread, and optionally start a new chat after login.
    const startNew = sessionStorage.getItem("sitealra_chat_start_new") === "1";
    if (startNew) sessionStorage.removeItem("sitealra_chat_start_new");

    // Prevent cross-user persistence during user switch.
    setThreads([]);
    setMessages([]);
    setActiveThreadIdState("");

    const existingThreads = loadChatThreads(userKey);

    const ensureInitial = (): {
      nextThreads: ChatThread[];
      nextActiveId: string;
    } => {
      if (existingThreads.length) {
        const storedActive = getActiveChatThreadId(userKey);
        const activeId =
          (storedActive && existingThreads.some((t) => t.id === storedActive)
            ? storedActive
            : existingThreads[0].id) || "";
        return { nextThreads: existingThreads, nextActiveId: activeId };
      }

      const initialMessages: ChatMessage[] = [
        {
          id: newId(),
          role: "assistant",
          content:
            "Halo! Aku asisten bisnis untuk UMKM kamu.\n\nSaat ini ini baru UI (belum tersambung ke Gemini). Kamu bisa mulai ketik kebutuhanmu seperti: ide promo, caption IG, atau rencana operasional harian.",
          createdAt: Date.now(),
        },
      ];

      const thread = createChatThread({ userKey, messages: initialMessages });
      const next = [thread];
      saveChatThreads(userKey, next);
      setActiveChatThreadId(userKey, thread.id);
      return { nextThreads: next, nextActiveId: thread.id };
    };

    const { nextThreads, nextActiveId } = ensureInitial();

    let finalThreads = nextThreads;
    let finalActiveId = nextActiveId;

    if (startNew) {
      const initialMessages: ChatMessage[] = [
        {
          id: newId(),
          role: "assistant",
          content:
            "Halo! Chat baru sudah dimulai.\n\nKamu bisa tanya tentang promosi, operasional, stok, pricing, dll.",
          createdAt: Date.now(),
        },
      ];
      const thread = createChatThread({ userKey, messages: initialMessages });
      finalThreads = [thread, ...finalThreads];
      finalActiveId = thread.id;
      saveChatThreads(userKey, finalThreads);
      setActiveChatThreadId(userKey, finalActiveId);
    }

    setThreads(finalThreads);
    setActiveThreadIdState(finalActiveId);

    const activeThread = finalThreads.find((t) => t.id === finalActiveId);
    setMessages(activeThread?.messages || []);

    setLoadedUserKey(userKey);
  }, [userKey]);

  useEffect(() => {
    if (loadedUserKey !== userKey) return;
    if (!activeThreadId) return;

    setThreads((prev) => {
      const next = prev.map((t) =>
        t.id === activeThreadId ? { ...t, messages, updatedAt: Date.now() } : t,
      );
      saveChatThreads(userKey, next);
      return next;
    });

    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, activeThreadId, userKey, loadedUserKey]);

  const setActiveThread = (threadId: string, nextThreads?: ChatThread[]) => {
    setActiveThreadIdState(threadId);
    setActiveChatThreadId(userKey, threadId);
    const list = nextThreads || threads;
    const t = list.find((x) => x.id === threadId);
    setMessages(t?.messages || []);
  };

  const onNewChat = () => {
    const initialMessages: ChatMessage[] = [
      {
        id: newId(),
        role: "assistant",
        content: `Halo! Aku asisten bisnis untuk ${profile.name || "UMKM kamu"}.\n\nChat baru sudah dimulai. Tanyakan apa saja!`,
        createdAt: Date.now(),
      },
    ];
    const thread = createChatThread({ userKey, messages: initialMessages });
    const nextThreads = [thread, ...threads];
    setThreads(nextThreads);
    saveChatThreads(userKey, nextThreads);
    setActiveThread(thread.id, nextThreads);
  };

  const onSend = async () => {
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

    setMessages((prev) => [...prev, userMsg]);

    // UI-first: placeholder response (no real AI call yet)
    window.setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: newId(),
        role: "assistant",
        content:
          "Noted. (UI dulu) Nanti kalau sudah disambungkan ke Gemini, aku bisa jawab lebih detail dan kontekstual. Saat ini aku belum melakukan proses AI/generasi ya.",
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setSending(false);
    }, 650);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Chatbot Bisnis
        </h1>
        <p className="text-gray-500 mt-2">
          Asisten untuk bantu owner menjalankan bisnis (UI dulu, AI menyusul).
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
              <Bot size={18} />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-gray-900 truncate">
                SIRA
              </div>
              <div className="text-xs text-gray-400 truncate">
                Konteks: {profile.name ? profile.name : "belum diisi"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={activeThreadId}
              onChange={(e) => setActiveThread(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-label="Pilih chat"
            >
              {threads
                .slice()
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
            </select>

            <button
              type="button"
              onClick={onNewChat}
              className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
            >
              Chat Baru
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
              <Info size={14} />
              FE-only
            </div>
          </div>
        </div>

        <div className="p-6">
          <div
            ref={listRef}
            className="h-[52vh] min-h-[360px] max-h-[620px] overflow-y-auto pr-2 space-y-4"
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
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap border ${
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

          <div className="mt-5">
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
                placeholder="Tanya apa saja tentang promosi, operasional, stok, pricing..."
                rows={2}
                className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-gray-900 placeholder-gray-400 text-sm resize-none"
              />

              <button
                type="button"
                onClick={onSend}
                disabled={!input.trim() || sending}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-2xl transition-colors text-sm"
                title="Kirim"
              >
                <Send size={16} />
                <span className="hidden sm:inline">Kirim</span>
              </button>
            </div>

            <div className="mt-2 text-xs text-gray-400">
              Enter untuk kirim, Shift+Enter untuk baris baru.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
