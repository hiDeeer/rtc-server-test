import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3000, {
  cors: {
    origin: [
      'https://225c-221-168-22-204.ngrok-free.app',
      'http://localhost:3001',
      'http://10.80.163.177:3001',
    ], // 허용할 출처
    methods: ['GET', 'POST'], // 허용할 메소드
    credentials: true, // 인증 정보 포함 여부
  },
})
export class WebrtcGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('offer')
  handleOffer(@MessageBody() data: any) {
    // Offer 수신 및 처리
    console.log('Received offer:', data);
    this.server.emit('offer', data); // 모든 클라이언트에게 Offer 전송
  }

  @SubscribeMessage('answer')
  handleAnswer(@MessageBody() data: any) {
    // Answer 수신 및 처리
    console.log('Received answer:', data);
    this.server.emit('answer', data); // 모든 클라이언트에게 Answer 전송
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(@MessageBody() data: any) {
    // ICE 후보 수신 및 처리
    console.log('Received ICE candidate:', data);
    this.server.emit('ice-candidate', data); // 모든 클라이언트에게 ICE 후보 전송
  }
}
