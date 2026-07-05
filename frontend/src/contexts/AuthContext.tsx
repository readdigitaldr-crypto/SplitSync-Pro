import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import type { User } from "../types";
type Auth = {
  user: User | null;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};
const C = createContext<Auth | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const refresh = async () => {
    if (localStorage.getItem("access")) {
      const { data } = await api.get("/auth/profile/");
      setUser(data);
    }
  };
  useEffect(() => {
    refresh().catch(() => logout());
  }, []);
  const login = async (username: string, password: string) => {
    const { data } = await api.post("/auth/login/", { username, password });
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    await refresh();
  };
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };
  const value = useMemo(() => ({ user, login, logout, refresh }), [user]);
  return <C.Provider value={value}>{children}</C.Provider>;
}
export const useAuth = () => {
  const v = useContext(C);
  if (!v) throw new Error("AuthProvider missing");
  return v;
};
