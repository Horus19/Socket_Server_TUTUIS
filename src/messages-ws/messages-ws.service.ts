import { Injectable } from '@nestjs/common';
import { CreateMessagesWDto } from './dto/create-messages-w.dto';
import { UpdateMessagesWDto } from './dto/update-messages-w.dto';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { mensajeDto } from "./dto/mensaje.dto";

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

  /**
   * @description: obtiene los mensajes de un usuario, ordenados por fecha de creacion
   * @param usuario
   * @param remitente
   */
  async getMessages(usuario: string, remitente: string) {
    //Obtiene los mensajes donde id es el destinatario y remitente es el remitente o viceversa
    const mensajes = await this.mensajeRepository
      .createQueryBuilder('mensaje')
      .leftJoinAndSelect('mensaje.remitente', 'remitente')
      .leftJoinAndSelect('mensaje.destinatario', 'destinatario')
      .where('remitente.id = :usuario AND destinatario.id = :remitente', {
        usuario,
        remitente,
      })
      .orWhere('remitente.id = :remitente AND destinatario.id = :usuario', {
        usuario,
        remitente,
      })
      .orderBy('mensaje.fechaCreacion', 'DESC')
      .getMany();
    return this.convertirMensajes(mensajes);
  }

  /**
   * @description: Convierte una lista de entidad Mensaje a una lista MensajeDto
   * @param mensajes
   */
  convertirMensajes(mensajes: Mensaje[]) {
    const mensajesDto = mensajes.map((mensaje) => {
      const { id, remitente, destinatario, mensaje: text } = mensaje;
      return {
        uuid: remitente.id,
        mensaje: text,
      };
    });
    return mensajesDto;
  }
}
