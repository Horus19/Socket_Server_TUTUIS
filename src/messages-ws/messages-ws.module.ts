import { Module } from '@nestjs/common';
import { MessagesWsService } from './messages-ws.service';
import { MessagesWsGateway } from './messages-ws.gateway';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { messagesController } from './messages.controller';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Mensaje])],
  providers: [MessagesWsGateway, MessagesWsService],
  exports: [MessagesWsService],
  controllers: [messagesController],
})
export class MessagesWsModule {}
