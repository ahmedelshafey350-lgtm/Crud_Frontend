import { createContext, useContext, useState } from "react";
import { api, extractToken } from "./api.js";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  async function login(email, password) {
    const data = await api.login(email, password);
    const t = extractToken(data);
    if (!t) throw new Error("Login worked but no token came back. Check extractToken in api.js.");
    localStorage.setItem("token", t);
    setToken(t);
  }
  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }
  return <Ctx.Provider value={{ token, login, logout }}>{children}</Ctx.Provider>;
}
