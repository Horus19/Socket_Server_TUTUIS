import { Controller, Get, Param } from '@nestjs/common';
import { MessagesWsService } from './messages-ws.service';

@Controller('messages')
export class messagesController {
  constructor(private readonly messagesWsService: MessagesWsService) {}

  /**
   * @description obtiene todos los mensajes de un usuario
   * @param id
   */
  @Get(':id')
  async getMessages(@Param('id') id: string) {
    return await this.messagesWsService.getMessages(id);
  }
}
