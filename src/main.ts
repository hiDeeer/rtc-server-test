import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as https from 'https';
import { Server } from 'socket.io';
import { WebrtcGateway } from './signaling.gateway';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  const httpsOptions = {
    key: readFileSync('./server.key'), // 개인 키 파일 경로
    cert: readFileSync('./server.cert'), // 인증서 파일 경로
  };

  const server = https.createServer(httpsOptions, app.getHttpAdapter().getInstance());

  // WebSocket Gateway와 연결된 Socket.IO 인스턴스 생성
  const io = new Server(server, {
    cors: {
      origin: [
        'https://225c-221-168-22-204.ngrok-free.app',
        'https://localhost:3001',
        'https://10.80.163.177:3001',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // WebSocketGateway에 Socket.IO 인스턴스 주입
  app.get(WebrtcGateway).server = io;

  await server.listen(30400);
  console.log('HTTPS server running on port 30400');
}
bootstrap();
