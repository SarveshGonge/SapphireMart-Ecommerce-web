import { createContext, useContext, useState, useCallback } from "react";
import { loginUser, registerUser } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({ fullName: data.fullName, email: data.email, role: data.role })
    );
    setUser({ fullName: data.fullName, email: data.email, role: data.role });
  };

  const login = useCallback(async (email, password) => {
    const { data } = await loginUser({ email, password });
    persist(data);
    return data;
  }, []);

  const register = useCallback(async (fullName, email, password) => {
    const { data } = await registerUser({ fullName, email, password });
    persist(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const isAdmin = user?.role === "ROLE_ADMIN";

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
