import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ChatContext } from "../contexts/ChatContext";
import { formatListTime, getChatTitle, getInitial } from "../lib/chat";

interface ChatProps {
  activeChatId: number | null;
  setActiveChatId: (chatId: number) => void;
}

const Chats = ({ setActiveChatId, activeChatId }: ChatProps) => {
  const { user } = useContext(AuthContext);
  const { chats, chatsLoading, chatsError, refreshChats } =
    useContext(ChatContext);

  useEffect(() => {
    refreshChats();
  }, [refreshChats]);
  return (
    <div>
      {chatsLoading && <h1 className="text-grey-400 text-xl">Loading...</h1>}
      {chatsError && <p className="text-red-400 text-sm">{chatsError}</p>}
      {!chatsLoading && !chatsError && chats.length === 0 && (
        <p className="text-white text-lg">Add a user to start chatting.</p>
      )}
      {chats.map((chat) => {
        const isActive = activeChatId === chat.id;
        const title = getChatTitle(chat, user?.id);
        const last = chat.lastMessage;
        return (
          <button
            type="button"
            aria-current={isActive}
            onClick={() => setActiveChatId(chat.id)}
            className={`text-white flex gap-3 my-3 p-2 font-semibold ${isActive ? "bg-[#9ba1ac]" : "hover:bg-[#171b22]"}`}
            key={chat.id}
          >
            <div className="w-10 h-10 rounded-full shrink-0 bg-white flex justify-center items-center text-black text-md font-bold">
              {getInitial(title)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex gap-3 justify-between">
                <span className="text-xl truncate">{title}</span>
                {last && (
                  <span className="shrink-0 text-sm">
                    {formatListTime(last.createdAt)}
                  </span>
                )}
              </div>
              <p className="truncate text-left leading-5 text-sm">
                {last
                  ? `${last.userId === user?.id ? "You: " : ""}${last.text}`
                  : "No messages yet"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Chats;
