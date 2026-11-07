import type { Chat } from "../types/ChatUsers.type";

export function getChatTitle(chat: Chat, myId?: number) {
  if (chat.isGroup) return chat.name;
  return chat.members.find((m) => m.id !== myId)?.name ?? chat.name;
}

export function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase();
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function formatListTime(iso: string) {
  const date = new Date(iso);
  const days = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / 86_400_000,
  );

  if (days <= 0) {
    return date.toLocaleDateString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (days < 7) return date.toLocaleDateString([], { weekday: "short" });
  return date.toLocaleDateString([], { day: "numeric", month: "short" });
}

export function formatMessageTime(iso: string) {
  return new Date(iso).toLocaleDateString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDay(iso: string) {
  const date = new Date(iso);
  const days = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / 86_400_000,
  );

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return date.toLocaleDateString([], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function isSameDay(a: string, b: string) {
  return startOfDay(new Date(a)) === startOfDay(new Date(b));
}
