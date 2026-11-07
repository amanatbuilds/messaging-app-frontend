import { IoMdSend } from "react-icons/io";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  formatDay,
  formatMessageTime,
  getChatTitle,
  getInitial,
  isSameDay,
} from "../lib/chat";
import { ChatContext } from "../contexts/ChatContext";
interface MessageBoxProps {
  activeChatId: number | null;
}
const MessageBox = ({ activeChatId }: MessageBoxProps) => {
  const { user } = useContext(AuthContext);
  const { chats, messages, hasMore, loadMessages, loadOlder, sendMessage } =
    useContext(ChatContext);
  const [loadingState, setLoadingState] = useState(false);
  const [sendError, setSendError] = useState("");
  const [historyError, setHistoryError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const chat = chats.find((c) => c.id === activeChatId);
  const chatMessages = activeChatId ? (messages[activeChatId] ?? []) : [];
  const lastMessageId = chatMessages.at(-1)?.id;
  const messageSchema = z.object({
    message: z
      .string()
      .trim()
      .min(1, { error: "Message must be at least 1 character" })
      .max(1000, { error: "Message cannot exceed 1000 characters" }),
  });

  type Schema = z.infer<typeof messageSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm({
    resolver: zodResolver(messageSchema),
  });

  useEffect(() => {
    if (!activeChatId) return;
    loadMessages(activeChatId).catch((err) => {
      console.error(err);
      setHistoryError("Could not load messages.");
    });
  }, [activeChatId, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lastMessageId]);

  const onSumbit = async ({ message }: Schema) => {
    if (!activeChatId) return;
    setSendError("");
    setLoadingState(true);
    try {
      await sendMessage(activeChatId, message);
      resetField("message");
    } catch (err) {
      setSendError("Message could not be sent. Please try again.");
      console.error(err);
    } finally {
      setLoadingState(false);
    }
  };
  if (!activeChatId || !chat) {
    return (
      <div className="flex-1 min-w-0 flex items-center justify-center h-screen bg-[#0B0D12] text-[#9BA1AC] text-xl">
        Select a chat to start messaging
      </div>
    );
  }

  const title = getChatTitle(chat, user?.id);
  return (
    <div className="flex-1 min-w-0 flex flex-col h-screen bg-[#0B0D12]">
      <header className="px-8 flex h-24 shrink-0 gap-3 items-center border-b border-[#282c34]">
        <div className="w-10 h-10 rounded-full shrink-0 bg-white flex justify-center items-center text-black text-lg font-bold">
          {getInitial(title)}
        </div>
        <h2 className="text-white text-3xl">{title}</h2>
      </header>

      <section className="flex flex-1 flex-col justify-end px-8 pb-10">
        <div className="flex-1" />
        {hasMore[activeChatId] && (
          <button
            className="mx-auto my-4 text-sm text-[#9BA1AC] hover:text-white cursor-pointer"
            type="button"
            onClick={() => loadOlder(activeChatId)}
          >
            Load older messages
          </button>
        )}

        {historyError && (
          <p className="text-center text-sm text-red-400">{historyError}</p>
        )}

        {chatMessages.length === 0 && !historyError && (
          <p className="text-center text-[#9BA1AC]">No messages yet. Say hi!</p>
        )}

        {chatMessages.map((m, i) => {
          const mine = m.userId === user?.id;
          const prev = chatMessages[i - 1];
          const newDay = !prev || !isSameDay(prev.createdAt, m.createdAt);
          return (
            <div key={m.id}>
              {newDay && (
                <div className="text-center text-[#9BA1AC] text-sm my-6">
                  {formatDay(m.createdAt)}
                </div>
              )}

              <div
                className={`flex mt-3 ${mine ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-40">
                  <div
                    className={`text-[18px] rounded-[20px] px-7 py-3 text-white wrap=break-words whitespace-pre-wrap ${mine ? "bg-[#6E62FF]" : "bg-[#242832]"} `}
                  >
                    {m.text}
                  </div>
                  <div
                    className={`mt-1 px-3 text-xs text-[#626A78] ${mine ? "text-right" : "text-left"}`}
                  >
                    {formatMessageTime(m.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </section>

      <div className="shrink-0 border-t border-[#282C34]">
        {(errors.message || sendError) && (
          <p className="px-6 pt-2 text-sm text-red-400">
            {errors.message?.message ?? sendError}
          </p>
        )}
      </div>

      <form
        className="px-6 h-24 flex items-center shrink-0 border-t border-[#282c34]"
        onSubmit={handleSubmit(onSumbit)}
      >
        <input
          type="text"
          {...register("message")}
          className="h-13 min-w-0 flex-1 px-5 bg-[#12151C] border-2 border-[#292e38] text-white outline-none focus:border-[#4a4f5b] placeholder:text-[#626a78] text-[20px] rounded-full"
          placeholder={`Message ${title}`}
          autoComplete="off"
        />

        <button
          type="submit"
          aria-label="Send message"
          disabled={loadingState}
          className="w-14 h-14 ms-2 flex items-center justify-center shrink-0 text-5xl cursor-pointer text-[#6b5cff] hover:scale-120 -rotate-20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoMdSend />
        </button>
      </form>
    </div>
  );
};

export default MessageBox;
