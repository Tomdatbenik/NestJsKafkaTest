import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'service-b',
        brokers: ['127.0.0.1:9092'],
      },
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(3001);
  console.log(`Service-b is running on: ${await app.getUrl()}`);
}
bootstrap();
