import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { WSPayloadDto } from 'src/utils/dtos';
import { WS_ROOMS } from 'src/utils/enums';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('WebsocketGateway');
  }

  afterInit(server: Server) {
    this.logger.verbose('Initialized WebSocket Server');
    server.on('connection', this.socketConnection);
  }

  socketConnection(socket: Socket) {
    console.log('Connection Success', socket.id);
    socket.join(WS_ROOMS.rates);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Websocket Disconnected: ${client.id}`);
  }

  public async emitWebSocketEvent(
    webSocketPayload: WSPayloadDto,
  ): Promise<any> {
    const { data, messageType, roomName } = webSocketPayload;
    this.server.to(roomName).emit(messageType, data);
    return;
  }
}
