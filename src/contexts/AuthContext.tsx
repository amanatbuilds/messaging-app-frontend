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
  loading: boolean;
}

const defaultVal: DefaultValue = {
  login: () => {},
  logout: () => {},
  user: null,
  token: null,
  loading: true,
};
export const AuthContext = createContext(defaultVal);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") || null,
  );
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
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
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ login, logout, user, token, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
