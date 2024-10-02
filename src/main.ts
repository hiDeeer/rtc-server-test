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
    key: readFileSync('/etc/letsencrypt/live/hideeer.p-e.kr/privkey.pem'),
    cert: readFileSync('/etc/letsencrypt/live/hideeer.p-e.kr/fullchain.pem'),
  };

  const server = https.createServer(httpsOptions, app.getHttpAdapter().getInstance());

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // WebRTC Gateway와 Socket.io 서버 연결
  const webrtcGateway = app.get(WebrtcGateway);
  webrtcGateway.server = io;

  // Socket.io 연결 이벤트 처리
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  await server.listen(3001);
  console.log('HTTPS server running on port 3001');
}

bootstrap();
