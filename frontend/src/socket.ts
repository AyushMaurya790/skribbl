import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5002";

const socket: Socket = io(URL, {
  autoConnect: true,
  transports: ["websocket"]
});

export default socket;
