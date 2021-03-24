import { Controller, Get } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'service-b',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'service-b',
      },
    },
  })
  client: ClientKafka;

  async onModuleInit() {
    this.client.subscribeToResponseOf('test');
    await this.client.connect();
  }

  @Get('/test')
  getHello() {
    console.log('test');
    const test: any = {
      email: 'cool@cool.com',
      firstname: 'firestname',
      lastname: 'lastname',
    };

    return this.client.send('test', test); // args - topic, message
  }
}
