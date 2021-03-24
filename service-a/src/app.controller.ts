import { Controller, Get } from '@nestjs/common';
import { Client, Transport, ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

    @Client({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: 'service-a',
                brokers: ['localhost:9092'],
            },
            consumer: {
                groupId: 'service-a'
            }
        }
    })
    client: ClientKafka;

  async onModuleInit() {
    this.client.subscribeToResponseOf('test');
    await this.client.connect();
  }

  @MessagePattern('test')
  ConsoleLogTest(@Payload() message: any): any { 
    const {email, firstname, lastname} = message.value;
    console.log(email, firstname, lastname);  
  }
}
