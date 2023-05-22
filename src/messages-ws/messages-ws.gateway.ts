import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect, ConnectedSocket
} from "@nestjs/websockets";
import { MessagesWsService } from './messages-ws.service';
import { CreateMessagesWDto } from './dto/create-messages-w.dto';
import { UpdateMessagesWDto } from './dto/update-messages-w.dto';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { CreateMensajeDto } from "./dto/create-mensaje.dto";

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly authService: AuthService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    console.log('Cliente conectado', client.id);
    const token = client.handshake.headers['x-token'].toString();
    const id = await this.authService.comprobarJWT(token);
    if (id == null) {
      return client.disconnect();
    }
    client.join(id);
    console.log('Cliente conectado', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado', client.id);
  }

  @SubscribeMessage('createMessagesW')
  create(@MessageBody() createMessagesWDto: CreateMessagesWDto) {
    return this.messagesWsService.create(createMessagesWDto);
  }

  @SubscribeMessage('findAllMessagesWs')
  findAll() {
    return this.messagesWsService.findAll();
  }

  @SubscribeMessage('findOneMessagesW')
  findOne(@MessageBody() id: number) {
    return this.messagesWsService.findOne(id);
  }

  @SubscribeMessage('updateMessagesW')
  update(@MessageBody() updateMessagesWDto: UpdateMessagesWDto) {
    return this.messagesWsService.update(
      updateMessagesWDto.id,
      updateMessagesWDto,
    );
  }

  @SubscribeMessage('removeMessagesW')
  remove(@MessageBody() id: number) {
    return this.messagesWsService.remove(id);
  }

  @SubscribeMessage('mensaje-personal')
  conectar(
    @MessageBody() mensaje: CreateMensajeDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.messagesWsService.createMessage(mensaje);
    client.to(mensaje.para).emit('mensaje-personal', mensaje);
  }
}
