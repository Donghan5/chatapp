"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: 'http://localhost:5173' }));
app.use(express_1.default.json());
const local_api_1 = __importDefault(require("./routes/api/login-api/local-api"));
app.use('/api/auth/local', local_api_1.default);
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});
io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
    });
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        socket.emit('joinedRoom', roomId);
    });
    socket.on('sendMessage', (data) => {
        const { roomId, message, senderId } = data;
        console.log(`Message from ${senderId} to room ${roomId}: ${message}`);
        // 1 step. auth, senderId === socket.data.user.id
        // 2 step. save message to DB (not implemented here)
        // 3 kafka producer (not implemented here)
        io.to(roomId).emit('newMessage', { message, senderId });
    });
});
const PORT = process.env.BACKEND_PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
