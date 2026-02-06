import { io, Socket } from "socket.io-client";

const URL = window.location.origin;

export const socket: Socket = io(`${URL}/chat`, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});

