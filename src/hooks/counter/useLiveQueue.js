import { useEffect, useState } from "react";
import { useSocket } from "../useSocket";

export const useLiveQueue = () => {
  const { socket, isConnected } = useSocket();
  const [activeQueue, setActiveQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleQueueUpdate = (payload) => {
      setActiveQueue(payload.data || []);
      setIsLoading(false);
    };

    socket.on("queueUpdated", handleQueueUpdate);

    const requestLatestQueue = () => socket.emit("requestQueueUpdate");

    if (isConnected) requestLatestQueue();

    socket.on("connect", requestLatestQueue);

    return () => {
      socket.off("queueUpdated", handleQueueUpdate);
      socket.off("connect", requestLatestQueue);
    };
  }, [socket, isConnected]);

  // Safety net: clear loading state if connected but server never responds
  useEffect(() => {
    if (!isConnected || !isLoading) return;
    const timeout = setTimeout(() => setIsLoading(false), 4000);
    return () => clearTimeout(timeout);
  }, [isConnected, isLoading]);

  return { activeQueue, isConnected, isLoading };
};
