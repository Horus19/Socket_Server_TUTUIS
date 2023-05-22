import { Injectable } from '@nestjs/common';
import { CreateMessagesWDto } from './dto/create-messages-w.dto';
import { UpdateMessagesWDto } from './dto/update-messages-w.dto';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class MessagesWsService {
  constructor(
    @InjectRepository(Mensaje)
    private readonly mensajeRepository: Repository<Mensaje>,
    private readonly authService: AuthService,
  ) {}
  create(createMessagesWDto: CreateMessagesWDto) {
    return 'This action adds a new messagesW';
  }

  findAll() {
    return `This action returns all messagesWs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} messagesW`;
  }

  update(id: number, updateMessagesWDto: UpdateMessagesWDto) {
    return `This action updates a #${id} messagesW`;
  }

  remove(id: number) {
    return `This action removes a #${id} messagesW`;
  }

  /**
   * @description: guarda el mensaje en la base de datos
   * @param mensaje
   */
  async createMessage(mensaje: CreateMensajeDto) {
    const { de, para, mensaje: msg } = mensaje;
    const remitente = await this.authService.findUserById(de);
    const destinatario = await this.authService.findUserById(para);
    const newMensaje = this.mensajeRepository.create({
      remitente,
      destinatario,
      mensaje: msg,
    });
    return await this.mensajeRepository.save(newMensaje);
  }
}
