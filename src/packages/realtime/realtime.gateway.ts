import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {ClassSerializerInterceptor, Logger, UseGuards, UseInterceptors, UsePipes, ValidationPipe} from '@nestjs/common';
import {Server} from 'socket.io';
import {SocketAuthGuard} from "./socket-auth.guard";
import {SocketConn} from "./socket.connection";
import {AuthService} from "../../collections/auth/auth.service";
import {MESSAGE_EVENT, OFFLINE_EVENT, ONLINE_EVENT, RealtimeService, UNAUTHORIZED_EVENT,} from "./realtime.service";
import {UsersService} from "../../collections/users/users.service";

@UsePipes(new ValidationPipe())
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(SocketAuthGuard)
@WebSocketGateway({
  transports: ['polling', 'websocket'],
  handlePreflightRequest: (req, res) => {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Credentials': true
    };
    res.writeHead(200, headers);
    res.end();
  }
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server | undefined;
  private logger: Logger = new Logger(RealtimeGateway.name);

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private realtimeService: RealtimeService,
  ) {
  }

  afterInit(server: Server) {
    this.logger.log(`Init socket server ${server.path()}`);
  }

  async handleDisconnect(client: SocketConn) {
    const userId = client.conn.userId;
    this.logger.warn(`Disconnected [uid: ${userId} - wsid: ${client.conn.id}]`);
    const otherUsers = this.realtimeService.getOtherUsers(userId);
    for (let i = 0; i < otherUsers.length; i++) {
      otherUsers[i].connection.emit(OFFLINE_EVENT, {
        user_id: userId
      });
    }

    // Remove user
    this.realtimeService.removeUser(client.conn.memoryId);

  }

  async handleConnection(client: SocketConn, ...args: any[]) {
    const authorized = await SocketAuthGuard.verifyToken(
      this.authService,
      this.realtimeService,
      client,
      client.handshake.headers.authorization,
    );

    if (!authorized) {
      this.logger.error(`[${client.id}] Socket UnauthorizedException`);
      client.emit(UNAUTHORIZED_EVENT, 'Unauthorized');
      client.disconnect(true);
      return;
    }

    const userId = client.conn.userId;
    this.logger.log(`Connected [uid: ${userId} - wsid: ${client.conn.id}]`);
    const otherUsers = this.realtimeService.getOtherUsers(userId);
    for (let i = 0; i < otherUsers.length; i++) {
      otherUsers[i].connection.emit(ONLINE_EVENT, {
        user_id: userId
      });
    }
  }

  // Send broadcast message to all
  // Server will save and forward that message
  @SubscribeMessage(MESSAGE_EVENT)
  async onMessageEvent(@ConnectedSocket() client: SocketConn, @MessageBody() data: any): Promise<string | number> {
    const userId = client.conn.userId;
    const otherUsers = this.realtimeService.getOtherUsers(userId);
    for (let i = 0; i < otherUsers.length; i++) {
      otherUsers[i].connection.emit(MESSAGE_EVENT, {
        from_id: userId,
        data: data
      });
    }
    return 0;
  }

}
