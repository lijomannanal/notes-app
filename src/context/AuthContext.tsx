import React, { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { jwtDecode } from "jwt-decode";

type User = {
  userId: string;
  name: string;
  username: string;
};

type ContextProps = {
  user: User | undefined;
  login: (token: string) => void;
  logout: () => void;
};
const AuthContext = createContext<ContextProps | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useLocalStorage("user");
  const [token, setToken] = useLocalStorage("token");
  // const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (token) {
      const user = decodeToken(token);
      setUser(user);
    }
  }, [token, setUser]);

  function decodeToken(token: string) {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
  const login = (token: string) => {
    setToken(token);
  };
  const logout = () => {
    setUser("");
    setToken("");
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
