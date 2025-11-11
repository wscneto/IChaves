import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { getCorsConfig } from '../middleware/cors';

let io: SocketIOServer;

export function initWebSocket(server: HttpServer) {
  io = new SocketIOServer(server, {
    path: '/socket.io',
    cors: getCorsConfig()
  });

  io.on('connection', (socket: Socket) => {
    console.log('🔌 New client connected', socket.id);

    socket.on('join', (userId: number) => {
      console.log(`[Socket.io] User ${socket.id} joining room user:${userId}`);
      socket.join(`user:${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected', socket.id);
    });
  });

  console.log('🚀 WebSocket server initialized');
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}
