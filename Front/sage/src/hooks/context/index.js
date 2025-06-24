"use client";
import { createContext, useContext, useState } from "react";

// api
import api from "@/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLogin = (email, password) => {
    setLoading(true);

    const data = {
      email,
      password,
    };

    api
      .post(("/login", data))
      .then((resp) => setUser(resp.data))
      .catch((error) => console.log(error, "Erro login."))
      .finally(() => setLoading(false));
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, fetchLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
