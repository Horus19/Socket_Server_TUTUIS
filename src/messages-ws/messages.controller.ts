import { Controller, Get, Param, Query } from '@nestjs/common';
import { MessagesWsService } from './messages-ws.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';

/**
 * @description controlador de mensajes
 * @param messagesWsService
 */
@Controller('messages')
export class messagesController {
  constructor(private readonly messagesWsService: MessagesWsService) {}

  /**
   * @description obtiene todos los mensajes de un usuario
   * @param id
   * @param usuario
   * @returns mensajes
   */
  @Get(':id')
  @Auth()
  async getMessages(@Param('id') id: string, @GetUser() usuario: User) {
    return await this.messagesWsService.getMessages(id, usuario.id);
  }
}
