"use client";
import { createContext, useContext, useState } from "react";

// api
import api from "@/api";

// Utils
import { formatDate3 } from "@/validators";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userCreate, setUserCreate] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLogin = (email, password) => {
    setLoading(true);

    const data = {
      email,
      password,
    };

    api
      .post("auth/jwt/create/", data)
      .then((resp) => {
        setUser(resp.data);
        localStorage.setItem("token", resp.data.access);
        localStorage.setItem("tokenReflesh", resp.data.refresh);
      })
      .catch((error) => {
        console.log("Login error:", error.response || error.message || error);
      })
      .finally(() => setLoading(false));
  };

  const fetchUserCreate = (
    name,
    document,
    email,
    birthDate,
    phone,
    income,
    password
  ) => {
    setLoading(true);

    const data = {
      name,
      email,
      cpf: document?.replace(/\.|-/g, ""),
      date_of_birth: formatDate3(birthDate),
      phone_number: phone?.replace(/\D/g, ""),
      income: income?.replace(/\./g, "").replace(",", "."),
      password,
    };

    api
      .post("auth/users/", data)
      .then((resp) => {
        setUserCreate(resp.data);
      })
      .catch((error) => {
        console.log(
          "User create error:",
          error.response || error.message || error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const cleanState = () => {
    setUserCreate(null);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenReflesh");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        fetchLogin,
        logout,
        loading,
        fetchUserCreate,
        userCreate,
        cleanState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
