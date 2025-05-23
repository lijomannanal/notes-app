// SocketContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../components/models/common";

const socketServerUrl = import.meta.env.VITE_SERVER_SOCKET_URL;

type ContextProps = {
  isConnected: boolean;
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined;
};
const SocketContext = createContext<ContextProps | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] =
    useState<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useLocalStorage("token");

  useEffect(() => {
    const newSocket = io(socketServerUrl, {
      autoConnect: false,
      query: {
        token,
      },
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      const latestToken = JSON.parse(localStorage.getItem("token") as string);
      setToken(latestToken);
      setTimeout(() => {
        console.log("retrying connection");
        newSocket.connect();
      }, 3000);
    });

    setSocket(newSocket);

    if (token) {
      newSocket.connect();
    } else {
      newSocket.disconnect();
    }

    return () => {
      newSocket.disconnect();
    };
  }, [token, setToken]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("Cannot get context");
  }
  return context;
};
