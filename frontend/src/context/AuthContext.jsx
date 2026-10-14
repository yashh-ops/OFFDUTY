import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
const Context = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let live = true;
    api("/auth/me")
      .then((d) => {
        if (live && d.user?.role === "customer") setUser(d.user);
      })
      .catch(() => {})
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);
  async function login(email, password) {
    const d = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(d.user);
    return d.user;
  }
  async function register(name, email, password) {
    const d = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    setUser(d.user);
    return d.user;
  }
  async function logout() {
    try {
      await api("/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }
  async function refresh() {
    const d = await api("/auth/me");
    setUser(d.user);
    return d.user;
  }
  return (
    <Context.Provider
      value={{ user, loading, login, register, logout, refresh }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAuth() {
  const value = useContext(Context);
  if (!value) throw new Error("AuthProvider missing");
  return value;
}
