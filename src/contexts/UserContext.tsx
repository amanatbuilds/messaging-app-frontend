import { createContext, useState, useEffect, type ReactNode } from "react";
import { API_URL } from "../lib/config";

export interface SentRequest {
  receiver: { id: number; name: string; username: string };
}

interface ResProviderUser {
  id: number;
  name: string;
  username: string;
  createdAt: string;
  sentRequests: SentRequest[];
  receivedRequests: [];
}
interface UserContextType {
  users: ResProviderUser[];
}
const defaultValue: UserContextType = {
  users: [],
};
export const UserContext = createContext(defaultValue);

export const UserProvider = ({ children }: { children: ReactNode }) => {
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
