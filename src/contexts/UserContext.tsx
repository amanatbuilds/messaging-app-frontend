import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useContext,
} from "react";
import { API_URL } from "../lib/config";
import { AuthContext } from "./AuthContext";

export interface FriendRequestUser {
  id: number;
  senderId: number;
  receiverId: number;
  createdAt: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}
interface ResProviderUser {
  id: number;
  name: string;
  username: string;
  createdAt: string;
  sentRequests: FriendRequestUser[];
  receivedRequests: FriendRequestUser[];
}
interface UserContextType {
  users: ResProviderUser[];
}
const defaultValue: UserContextType = {
  users: [],
};
export const UserContext = createContext(defaultValue);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState<ResProviderUser[]>([]);

  useEffect(() => {
    async function getAllUsers() {
      try {
        const res = await fetch(`${API_URL}/api/users`);
        if (!res.ok) {
          console.log(res);
          return;
        }
        const data = await res.json();
        setUsers(data.users);
        console.log(user?.name);
        console.log(users.find((resUser) => resUser.id === user?.id));
        // setSentFriendRequest(
        //   data.users.find(
        //     (resUser: ResProviderUser) => resUser.id === user?.id,
        //   ),
        // );
        // setReceivedRequestUsers(data.users.receivedRequests);
        console.table(data.users);
      } catch (error) {
        console.error(error);
      }
    }
    getAllUsers();
  }, []);
  return (
    <UserContext.Provider value={{ users }}>{children}</UserContext.Provider>
  );
};
