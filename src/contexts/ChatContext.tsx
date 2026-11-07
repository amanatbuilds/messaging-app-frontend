import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Chat, Message } from "../types/ChatUsers.type";
import { AuthContext } from "./AuthContext";
import { API_URL } from "../lib/config";

const POLL_MS = 4000;
const PAGE_SIZE = 50;

interface ChatContextType {
  chats: Chat[];
  chatsLoading: boolean;
  chatsError: string;
  messages: Record<number, Message[]>;
  hasMore: Record<number, boolean>;
  refreshChats: () => Promise<void>;
  loadMessages: (chatId: number) => Promise<void>;
  loadOlder: (chatId: number) => Promise<void>;
  sendMessage: (chatId: number, text: string) => Promise<void>;
  openDirectChat: (friendId: number) => Promise<number>;
}

const defaultValue: ChatContextType = {
  chats: [],
  chatsLoading: true,
  chatsError: "",
  messages: {},
  hasMore: {},
  refreshChats: async () => {},
  loadMessages: async () => {},
  loadOlder: async () => {},
  sendMessage: async () => {},
  openDirectChat: async () => 0,
};

export const ChatContext = createContext(defaultValue);

function mergeMessages(existing: Message[], incoming: Message[]) {
  const byId = new Map(existing.map((m) => [m.id, m]));
  incoming.forEach((m) => byId.set(m.id, m));
  return [...byId.values()].sort((a, b) => a.id - b.id);
}

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { logout, token } = useContext(AuthContext);
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [chatsError, setChatsError] = useState("");
  const [messages, setMessages] = useState<Record<number, Message[]>>({});
  const [hasMore, setHasMore] = useState<Record<number, boolean>>({});

  const cursors = useRef<Record<number, number | null>>({});
  const chatsRef = useRef<Chat[]>([]);
  const logoutRef = useRef(logout);

  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);
  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);

  const request = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const res = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) logoutRef.current();
      if (!res.ok) throw new Error(`Request Failed: ${res.status}`);
      return res.json();
    },
    [token],
  );

  const applyMessages = useCallback((incoming: Message[]) => {
    if (incoming.length === 0) return;

    setMessages((prev) => {
      const next = { ...prev };
      const byChat = new Map<number, Message[]>();
      incoming.forEach((m) => {
        byChat.set(m.chatId, [...(byChat.get(m.chatId) ?? []), m]);
      });
      byChat.forEach((list, chatId) => {
        next[chatId] = mergeMessages(prev[chatId] ?? [], list);
      });
      return next;
    });

    setChats((prev) =>
      prev.map((chat) => {
        const latest = incoming
          .filter((m) => m.chatId === chat.id)
          .reduce<Message | null>((a, m) => (!a || m.id > a.id ? m : a), null);
        if (latest && (!chat.lastMessage || latest.id > chat.lastMessage.id)) {
          return { ...chat, lastMessage: latest };
        }
        return chat;
      }),
    );
  }, []);

  const refreshChats = useCallback(async () => {
    try {
      const data = await request("/api/chats");
      setChats(data.chats ?? []);
      setChatsError("");
    } catch (err) {
      console.error("Failed to fetch chats", err);
      setChatsError("Could not load your chats. Please try again.");
    } finally {
      setChatsLoading(false);
    }
  }, [request]);

  useEffect(() => {
    if (token) refreshChats();
  }, [token, refreshChats]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let lastId: number | undefined;

    async function tick() {
      if (!document.hidden) {
        try {
          const qs = lastId === undefined ? "" : `?after=${lastId}`;
          const data = await request(`/api/chats/updates${qs}`);
          if (cancelled) return;
          lastId = data.lastId;
          const incoming: Message[] = data.messages ?? [];
          if (incoming.length > 0) {
            applyMessages(incoming);
            const unknownChat = incoming.some(
              (m) => !chatsRef.current.some((c) => c.id === m.chatId),
            );
            if (unknownChat) refreshChats();
          }
        } catch (err) {
          console.error("Polling failed", err);
        }
      }
      if (!cancelled) timer = setTimeout(tick, POLL_MS);
    }
    tick();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [token, request, applyMessages, refreshChats]);

  const loadMessages = useCallback(
    async (chatId: number) => {
      if (cursors.current[chatId] !== undefined) return;
      const data = await request(
        `/api/chats/${chatId}/messages?limit=${PAGE_SIZE}`,
      );
      cursors.current[chatId] = data.nextCursor ?? null;
      setHasMore((p) => ({ ...p, [chatId]: data.nextCursor != null }));
      applyMessages(data.messages ?? []);
    },
    [request, applyMessages],
  );

  const loadOlder = useCallback(
    async (chatId: number) => {
      const cursor = cursors.current[chatId];
      if (cursor == null) return;
      const data = await request(
        `/api/chats/${chatId}/messages?limit=${PAGE_SIZE}&cursor=${cursor}`,
      );
      cursors.current[chatId] = data.nextCursor ?? null;
      setHasMore((p) => ({ ...p, [chatId]: data.nextCursor != null }));
      applyMessages(data.messages ?? []);
    },
    [request, applyMessages],
  );

  const sendMessage = useCallback(
    async (chatId: number, text: string) => {
      const data = await request(`/api/chats/${chatId}/messages`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      applyMessages([data.message]);
    },
    [request, applyMessages],
  );

  const openDirectChat = useCallback(
    async (friendId: number) => {
      const data = await request(`/api/chats/direct/${friendId}`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      await refreshChats();
      return data.chat.id as number;
    },
    [request, refreshChats],
  );

  const sortedChats = useMemo(
    () =>
      [...chats].sort(
        (a, b) =>
          (b.lastMessage?.id ?? 0) - (a.lastMessage?.id ?? 0) || b.id - a.id,
      ),
    [chats],
  );

  const value = useMemo(
    () => ({
      chats: sortedChats,
      chatsLoading,
      chatsError,
      messages,
      hasMore,
      refreshChats,
      loadMessages,
      loadOlder,
      sendMessage,
      openDirectChat,
    }),
    [
      sortedChats,
      chatsLoading,
      chatsError,
      messages,
      hasMore,
      refreshChats,
      loadMessages,
      loadOlder,
      sendMessage,
      openDirectChat,
    ],
  );
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
