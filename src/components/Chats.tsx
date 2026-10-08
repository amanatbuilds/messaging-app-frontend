import type { User } from "../pages/Home";
interface ChatProps {
  activeUser: User | null;
  setActiveUser: React.Dispatch<React.SetStateAction<User | null>>;
  users: User[];
}
const Chats = ({ users, setActiveUser, activeUser }: ChatProps) => {
  return (
    <div>
      {users.map((user) => (
        <div
          onClick={() => setActiveUser(user)}
          className={`text-white flex gap-3 my-3 p-2 font-semibold ${activeUser?.name === user.name ? "bg-[#9ba1ac]" : "hover:bg-[#171b22]"}`}
          key={user.id}
        >
          <div className="w-10 h-10 rounded-full shrink-0 bg-white flex justify-center items-center text-black text-md font-bold">
            {user.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex gap-3 justify-between">
              <span className="text-xl">{user.name}</span>
              <span>Mon</span>
            </div>
            <p className="truncate leading-5 text-sm">{user.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
