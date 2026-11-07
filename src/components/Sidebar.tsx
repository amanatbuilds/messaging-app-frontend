import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Chats from "./Chats";
import AddUser from "./AddUser";
import RequestUser from "./RequestUser";

interface SidebarProps {
  activeChatId: number | null;
  setActiveChatId: (chatId: number | null) => void;
}

const Sidebar = ({ activeChatId, setActiveChatId }: SidebarProps) => {
  const [activeTab, setActiveTab] = useState("message");
  const { logout, user } = useContext(AuthContext);

  return (
    <aside className="w-86 bg-[#12151C] shrink-0 min-h-screen overflow-hidden px-3 py-5">
      <div className="flex justify-between items-center my-3">
        <div
          onClick={() => setActiveTab("message")}
          className={`border-2 border-[#9BA1AC] p-2 rounded-full cursor-pointer ${activeTab === "message" && "bg-[#33E6C4]"} hover:bg-[#191D26]`}
        >
          <h1 className="text-white text-md font-semibold">Messages</h1>
        </div>
        <div
          onClick={() => setActiveTab("add users")}
          className={`border-2 border-[#9ba1ac] p-2 rounded-full cursor-pointer ${activeTab === "add users" && "bg-[#33E6C4]"}`}
        >
          <h1 className="text-white text-md font-semibold">Add User</h1>
        </div>

        <div
          onClick={() => setActiveTab("your requests")}
          className={`border-2 border-[#9ba1ac] p-2 rounded-full cursor-pointer ${activeTab === "your requests" && "bg-[#33E6C4]"}`}
        >
          <h1 className="text-white text-md font-semibold">Your Requests</h1>
        </div>
      </div>

      {activeTab === "message" && (
        <div className="mt-8">
          <Chats
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
          />
        </div>
      )}
      {activeTab === "add users" && (
        <div className="mt-8">
          <AddUser />
        </div>
      )}

      {activeTab === "your requests" && <RequestUser />}

      <div className="fixed bottom-0 mb-3 flex gap-3 items-center">
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-white">
          {user?.name.split(" ")[0][0]}
        </div>
        <div className="text-white">{user?.name}</div>
        <div
          className="ms-22 text-2xl text-red-400 cursor-pointer"
          onClick={() => logout()}
        >
          Logout
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
