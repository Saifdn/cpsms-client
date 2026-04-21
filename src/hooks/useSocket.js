// hooks/useSocket.js
import { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

let socketInstance = null;

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }
  return socketInstance;
};

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => {
      console.log("✅ Global Socket.IO Connected");
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log("❌ Global Socket.IO Disconnected");
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Initial connection
    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return { socket: getSocket(), isConnected };
};