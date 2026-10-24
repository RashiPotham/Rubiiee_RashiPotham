import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api.js";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (localStorage.getItem("woe_token")) api("/auth/me").then(d => setUser(d.user)).catch(() => localStorage.removeItem("woe_token")).finally(() => setLoading(false));
    else setLoading(false);
  }, []);
  async function signIn(email, password) {
    const d = await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    localStorage.setItem("woe_token", d.token); setUser(d.user); return d.user;
  }
  async function signUp(name, email, password) {
    const d = await api("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
    localStorage.setItem("woe_token", d.token); setUser(d.user); return d.user;
  }
  function signOut() { localStorage.removeItem("woe_token"); setUser(null); }
  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);