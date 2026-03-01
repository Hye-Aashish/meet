import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (roomId: string, userId: string, userName: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const serverUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const socket = io(serverUrl);
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join', { roomId, userId, name: userName });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, userId, userName]);

  return { socket: socketRef.current, isConnected };
};
