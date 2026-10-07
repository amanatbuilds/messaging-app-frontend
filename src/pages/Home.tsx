import Sidebar from "../components/Sidebar";
import MessageBox from "../components/MessageBox";
import { useState } from "react";

export interface User {
  id: number;
  name: string;
  username: string;
  message: string;
  avatar: string;
}

const Home = () => {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  return (
    <div className="flex">
      <Sidebar activeUser={activeUser} setActiveUser={setActiveUser} />
      <MessageBox activeUser={activeUser} />
    </div>
  );
};

export default Home;
