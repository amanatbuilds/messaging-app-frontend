import Sidebar from "../components/Sidebar";
import MessageBox from "../components/MessageBox";
import { useState } from "react";
import { ChatProvider } from "../contexts/ChatContext";

export interface User {
  id: number;
  name: string;
  username: string;
  message: string;
  avatar: string;
}

const Home = () => {
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  return (
    <ChatProvider>
      <div className="flex">
        <Sidebar
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
        />
        <MessageBox key={activeChatId} activeChatId={activeChatId} />
      </div>
    </ChatProvider>
  );
};

export default Home;
