import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { RabbitMqService } from '../auth/rabbit-mq/rabbit-mq.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly authService: AuthService,
    private readonly rabbitMqService: RabbitMqService,
  ) {
    rabbitMqService.connectToRabbitMQ().then(() => {
      this.setupSubscribers().then(() => console.log('Subscripto a RabbitMQ'));
    });
  }

  client: Socket;

  async handleConnection(client: Socket, ...args: any[]) {
    console.log('Cliente conectado', client.id);
    const token = client.handshake.headers['x-token'].toString();
    const id = await this.authService.comprobarJWT(token);
    if (id == null) {
      return client.disconnect();
    }
    this.client = client;

    client.join(id);
    console.log('Cliente conectado', client.id);

    // Join notifications room
    const notificationsRoom = `notifications:${id}`;
    client.join(notificationsRoom);
  }
  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado', client.id);
  }

  @SubscribeMessage('mensaje-personal')
  conectar(
    @MessageBody() mensaje: CreateMensajeDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.messagesWsService.createMessage(mensaje);
    client.to(mensaje.para).emit('mensaje-personal', mensaje);
  }

  async setupSubscribers() {
    const channel = await this.rabbitMqService.getChannelRef();
    const exchange = 'user.exchange';

    // Subscriber for send-notification queue
    const sendNotificationQueue = 'send-notification';
    const sendNotificationRoutingKey = 'send-notification';

    await channel.assertExchange(exchange, 'direct', { durable: true });
    await channel.assertQueue(sendNotificationQueue, { durable: true });
    await channel.bindQueue(
      sendNotificationQueue,
      exchange,
      sendNotificationRoutingKey,
    );

    await channel.consume(sendNotificationQueue, async (msg) => {
      const content = msg.content.toString();
      console.log('Payload recibido:', content);
      // Realiza las acciones necesarias con el payload recibido
      const payload = JSON.parse(content);
      //Envia el mensaje a la sala de notificaciones del usuario
      const notificationsRoom = `notifications:${payload.to}`;
      console.log(notificationsRoom);
      this.client.to(notificationsRoom).emit(notificationsRoom, payload);
      channel.ack(msg);
    });
  }
}
