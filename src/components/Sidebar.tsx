import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import type { User } from "../pages/Home";

interface SidebarProps {
  activeUser: User | null;
  setActiveUser: React.Dispatch<React.SetStateAction<User | null>>;
}
const Sidebar = ({ activeUser, setActiveUser }: SidebarProps) => {
  const { logout } = useContext(AuthContext);
  const arr = [
    {
      id: 1,
      name: "Fake User",
      avatar: "FU",
      message: "Send an API Docs",
      username: "fake_10",
    },
    {
      id: 2,
      name: "Amara Chen",
      avatar: "AC",
      message: "Send an API Docs",
      username: "amara_12",
    },
    {
      id: 3,
      name: "Aman Khan",
      avatar: "AK",
      message: "Send an API Docs",
      username: "hello_11",
    },
    {
      id: 4,
      name: "John Doe",
      avatar: "JD",
      message: "Send an API Docs for project",
      username: "john_19",
    },
  ];
  return (
    <aside className="w-80 bg-[#12151C] shrink-0 min-h-screen overflow-hidden px-3 py-5">
      <div>
        <h1 className="text-white text-3xl font-semibold">Messages</h1>
      </div>

      <div className="mt-8">
        {arr.map((num) => (
          <div
            onClick={() => setActiveUser(num)}
            className={`text-white flex gap-3 my-3 p-2 font-semibold ${activeUser?.name === num.name ? "bg-[#9ba1ac]" : "hover:bg-[#171b22]"}`}
          >
            <div className="w-10 h-10 rounded-full shrink-0 bg-white flex justify-center items-center text-black text-md font-bold">
              {num.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex gap-3 justify-between">
                <span className="text-xl">{num.name}</span>
                <span>Mon</span>
              </div>
              <p className="truncate leading-5 text-sm">{num.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="fixed bottom-0 mb-3 text-2xl text-red-400 cursor-pointer"
        onClick={() => logout()}
      >
        Logout
      </div>
    </aside>
  );
};

export default Sidebar;
