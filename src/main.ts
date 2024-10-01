import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://225c-221-168-22-204.ngrok-free.app', // 허용할 출처
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 허용할 메소드
    credentials: true, // 인증 정보 포함 여부
  });

  await app.listen(3002);
}
bootstrap();
