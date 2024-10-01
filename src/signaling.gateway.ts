import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3000, { cors: true }) // 포트 3000에서 WebSocket 서버를 생성
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
