import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { API_URL } from "../lib/config";
import { AuthContext } from "./AuthContext";

export type Relation = "none" | "sent" | "received" | "friends";

export interface ResProviderUser {
  id: number;
  name: string;
  username: string;
  createdAt: string;
  relation: Relation;
}
interface UserContextType {
  users: ResProviderUser[];
  loading: boolean;
  refetchUsers: () => Promise<void>;
}
const defaultValue: UserContextType = {
  users: [],
  loading: true,
  refetchUsers: async () => {},
};
export const UserContext = createContext(defaultValue);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<ResProviderUser[]>([]);
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const refetchUsers = useCallback(async () => {
    if (!token) {
      setUsers([]);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Request Failed: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setUsers(data.users ?? []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  }, [token]);

  useEffect(() => {
    refetchUsers().finally(() => setLoading(false));
  }, [refetchUsers]);
  const value = useMemo(
    () => ({ users, loading, refetchUsers }),
    [users, loading, refetchUsers],
  );
  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};
