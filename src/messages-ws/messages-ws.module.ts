import { Module } from '@nestjs/common';
import { MessagesWsService } from './messages-ws.service';
import { MessagesWsGateway } from './messages-ws.gateway';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mensaje } from './entities/mensaje.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Mensaje])],
  providers: [MessagesWsGateway, MessagesWsService],
})
export class MessagesWsModule {}
