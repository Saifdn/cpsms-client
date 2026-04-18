// hooks/counter/useLiveQueue.js
import { useEffect, useState } from "react";
import { useSocket } from "../useSocket";

export const useLiveQueue = () => {
  const { socket, isConnected } = useSocket();
  const [activeQueue, setActiveQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleQueueUpdate = (payload) => {
      console.log("📡 Live queue update received:", payload.count || 0, "items");
      setActiveQueue(payload.data || []);
      setIsLoading(false);
    };

    // Listen for live updates
    socket.on("queueUpdated", handleQueueUpdate);

    // Request latest queue data whenever we connect or reconnect
    const requestLatestQueue = () => {
      console.log("🔄 Requesting latest queue data...");
      socket.emit("requestQueueUpdate");   // We'll handle this on backend
    };

    // Request data when connected
    if (isConnected) {
      requestLatestQueue();
    }

    // Also request when connection is re-established
    socket.on("connect", requestLatestQueue);

    return () => {
      socket.off("queueUpdated", handleQueueUpdate);
      socket.off("connect", requestLatestQueue);
    };
  }, [socket, isConnected]);

  return {
    activeQueue,
    isConnected,
    isLoading,
  };
};