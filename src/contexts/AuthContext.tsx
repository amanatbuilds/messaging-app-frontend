import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState, type ReactNode } from "react";

interface User {
  id: number;
  name: string;
  username: string;
  exp: number;
  iat: number;
}

interface DefaultValue {
  login: (newToken: string) => void;
  logout: () => void;
  user: User | null;
  token: string | null;
}

const defaultVal: DefaultValue = {
  login: () => {},
  logout: () => {},
  user: null,
  token: null,
};
export const AuthContext = createContext(defaultVal);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const decode: User = jwtDecode(token);

      if (decode.exp! * 1000 < Date.now()) {
        throw new Error("Token is expired");
      }
      setUser(decode);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, user, token }}>
      {children};
    </AuthContext.Provider>
  );
};
