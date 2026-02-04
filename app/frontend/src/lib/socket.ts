import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3000";

export const socket: Socket = io(`${URL}/chat`, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});

