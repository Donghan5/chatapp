import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const socket: Socket = io(`${URL}/chat`, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});

