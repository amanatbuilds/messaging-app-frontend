import { useState } from "react";

type Conversation = {
  name: string;
  initials: string;
  preview: string;
  time: string;
  avatar: string;
  text: string;
  online: boolean;
};

const conversations: Conversation[] = [
  {
    name: "Amara Chen",
    initials: "AC",
    preview: "Looks great, I'll check after that work.",
    time: "10:16 AM",
    avatar: "bg-emerald-950",
    text: "text-teal-300",
    online: true,
  },
  {
    name: "Raj Kapoor",
    initials: "RK",
    preview: "Sent the API docs over",
    time: "Yesterday",
    avatar: "bg-indigo-950",
    text: "text-violet-300",
    online: false,
  },
  {
    name: "Sofia Lin",
    initials: "SL",
    preview: "Thanks for the review!",
    time: "Mon",
    avatar: "bg-orange-950",
    text: "text-orange-300",
    online: true,
  },
];

function Avatar({
  initials,
  avatar,
  text,
  online,
  size = "large",
}: {
  initials: string;
  avatar: string;
  text: string;
  online: boolean;
  size?: "small" | "large";
}) {
  return (
    <div
      className={[
        "relative flex shrink-0 items-center justify-center rounded-full font-semibold",
        avatar,
        text,
        size === "large" ? "h-12 w-12 text-[22px]" : "h-12 w-12 text-[18px]",
      ].join(" ")}
    >
      {initials}

      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#12151b] bg-[#3bdd8a]" />
      )}
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState(0);
  const [message, setMessage] = useState("");

  const conversation = conversations[active];

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    console.log("Message:", message);
    setMessage("");
  };

  return (
    <div className="bg-[#151515]  text-white">
      {/* Outer browser frame */}
      <div className="w-full mx-3 mb-6 flex h-210 overflow-hidden rounded-[15px] bg-[#090c11]">
        {/* Sidebar */}
        <aside className="w-100 shrink-0 border-r border-[#282c34] bg-[#12151b]">
          {/* Sidebar header */}
          <div className="flex h-23 items-center px-8">
            <h1 className="text-[28px] font-bold tracking-tight">Messages</h1>
          </div>

          {/* Conversations */}
          <div>
            {conversations.map((item, index) => (
              <button
                key={item.name}
                onClick={() => setActive(index)}
                className={[
                  "flex h-12 w-full items-center gap-5 mt-10",
                  "transition-colors",
                  active === index ? "bg-[#1a1f29]" : "hover:bg-[#171b22]",
                ].join(" ")}
              >
                <Avatar
                  initials={item.initials}
                  avatar={item.avatar}
                  text={item.text}
                  online={item.online}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-[25px] font-semibold">
                      {item.name}
                    </span>

                    <span className="shrink-0 text-[18px] text-[#747b87]">
                      {item.time}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-[24px] leading-7 text-[#9298a5]">
                    {item.preview}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main chat */}
        <main className="flex min-w-0 flex-1 flex-col bg-[#090c11]">
          {/* Chat header */}
          <header className="flex h-28 shrink-0 items-center border-b border-[#282c34] px-10">
            <Avatar
              initials={conversation.initials}
              avatar={conversation.avatar}
              text={conversation.text}
              online={conversation.online}
              size="small"
            />

            <div className="ml-5">
              <div className="text-[25px] font-semibold">
                {conversation.name}
              </div>

              <div className="text-[20px] text-[#32db91]">Active now</div>
            </div>
          </header>

          {/* Messages */}
          <section className="flex flex-1 flex-col justify-end px-10 pb-10">
            <div className="mb-8 text-center text-[20px] text-[#707887]">
              Today
            </div>

            {/* Incoming */}
            <div className="flex justify-start">
              <div className="max-w-152.5 rounded-[25px] bg-[#1a1f29] px-7 py-5 text-[25px] leading-[1.35] text-[#e8e9ed]">
                Pushed the updated onboarding flow, ready for review.
              </div>
            </div>

            {/* Outgoing */}
            <div className="mt-5 flex justify-end">
              <div className="max-w-170 rounded-[27px] bg-[#6758f7] px-7 py-5 text-[25px] leading-[1.35] text-white">
                Looks great, I'll check it after standup.
              </div>
            </div>

            {/* Incoming */}
            <div className="mt-5 flex justify-start">
              <div className="rounded-[26px] bg-[#1a1f29] px-7 py-5 text-[25px] leading-[1.35] text-[#e8e9ed]">
                Perfect, I'll wait to hear from you.
              </div>
            </div>
          </section>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="flex h-29 shrink-0 items-center gap-5 border-t border-[#282c34] px-9"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${conversation.name.split(" ")[0]}`}
              className="
                  h-17 min-w-0 flex-1 rounded-full
                  border-2 border-[#292e38]
                  bg-[#12151b] px-7
                  text-[23px] text-white
                  outline-none
                  placeholder:text-[#626a78]
                  focus:border-[#4a4f5b]
                "
            />

            <button
              type="submit"
              aria-label="Send message"
              className="flex h-14 w-14 shrink-0 items-center justify-center text-[#6b5cff] transition hover:scale-105"
            >
              <svg viewBox="0 0 58 44" fill="none" className="h-10 w-12">
                <path
                  d="M3 30c8-4 12-13 19-13 7 0 9 10 17 10 6 0 8-5 15-10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <path
                  d="M39 9c6 1 11 4 15 8-4 1-8 4-11 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
