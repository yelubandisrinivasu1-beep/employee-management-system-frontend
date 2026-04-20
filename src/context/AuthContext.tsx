"use client";

import { createContext, useContext, useEffect, useState } from "react";
import API from "@/lib/axios";

type UserType = {
  _id: string;
  name: string;
  email: string;
  role: "manager" | "technical_manager" | "employee" | "admin";
};

type AuthContextType = {
  user: UserType | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: UserType) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    let parsedUser = null;
    if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
      try {
        parsedUser = JSON.parse(savedUser);
      } catch (e) {
        console.error("Failed to parse user", e);
        localStorage.removeItem("user");
      }
    }

    if (savedToken && savedToken !== "undefined" && savedToken !== "null" && parsedUser) {
      setToken(savedToken);
      setUser(parsedUser);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: UserType) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    try {
      if (token) {
        await API.post("/auth/logout");
      }
    } catch(err) {
      console.error("Logout beacon failed", err);
    }
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
