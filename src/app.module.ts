import { Module } from '@nestjs/common';
import { WebrtcGateway } from './signaling.gateway';

@Module({
  providers: [WebrtcGateway],
})
export class AppModule {}
