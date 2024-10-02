import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

interface Offer {
  type: 'offer';
  offer: RTCSessionDescriptionInit;
}

interface Answer {
  type: 'answer';
  answer: RTCSessionDescriptionInit;
}

interface IceCandidate {
  type: 'ice-candidate';
  candidate: RTCIceCandidateInit;
}

@WebSocketGateway()
export class WebrtcGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('offer')
  handleOffer(@MessageBody() data: Offer) {
    if (data.type !== 'offer' || !data.offer) {
      console.error('Invalid offer message:', data);
      return;
    }

    console.log('Received offer from client:', data);
    this.server.emit('offer', data);
  }

  @SubscribeMessage('answer')
  handleAnswer(@MessageBody() data: Answer) {
    if (data.type !== 'answer' || !data.answer) {
      console.error('Invalid answer message:', data);
      return;
    }

    console.log('Received answer from client:', data);
    this.server.emit('answer', data);
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(@MessageBody() data: IceCandidate) {
    console.log('Received ICE candidate from client:', data); // 추가 로그
    if (data.type !== 'ice-candidate' || !data.candidate) {
      console.error('Invalid ICE candidate message:', data);
      return;
    }

    this.server.emit('ice-candidate', data);
  }
}
