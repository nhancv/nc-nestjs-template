import {Injectable, Logger} from '@nestjs/common';
import {InjectInMemoryDBService, InMemoryDBService} from "@nestjs-addons/in-memory-db";
import {WsUserEntity} from "./entities/ws-user.entity";
import {SocketConn} from "./socket.connection";

export const MESSAGE_EVENT = 'message-event';
// online. When A online, send to friend of A
export const ONLINE_EVENT = 'online-event';
// offline. When A offline, send to friend of A
export const OFFLINE_EVENT = 'offline-event';
// unauthorized
export const UNAUTHORIZED_EVENT = 'unauthorized-event';

@Injectable()
export class RealtimeService {

  private readonly logger = new Logger(RealtimeService.name);

  constructor(
    @InjectInMemoryDBService('user') private wsUserService: InMemoryDBService<WsUserEntity>,
  ) {
  }

  // Save user
  storeUser(connection: SocketConn): WsUserEntity {
    const newUser: Partial<WsUserEntity> = {
      connection: connection,
      userId: connection.conn.userId,
      socketId: connection.conn.id,
      timestamp: Date.now()
    }
    return this.wsUserService.create(newUser);
  }

  // Remove user
  removeUser(memoryId: string): void {
    this.wsUserService.delete(memoryId);
  }

  // Get user. 1 user can has multi socket instance
  getUser(userId: string): WsUserEntity | null {
    const wsUsers: WsUserEntity[] = this.wsUserService.getAll();
    for (let i = 0; i < wsUsers.length; i++) {
      if (wsUsers[i].userId === userId) {
        return wsUsers[i];
      }
    }
    return null;
  }

  // Get all other users.
  getOtherUsers(userId: string): WsUserEntity[] {
    const wsUsers: WsUserEntity[] = this.wsUserService.getAll();
    const res: WsUserEntity[] = [];
    for (let i = 0; i < wsUsers.length; i++) {
      if (wsUsers[i].userId !== userId) {
        res.push(wsUsers[i]);
      }
    }
    return res;
  }

  isOnline(userId: string): boolean {
    const wsUsers: WsUserEntity[] = this.wsUserService.getAll();
    for (let i = 0; i < wsUsers.length; i++) {
      if (wsUsers[i].userId === userId) {
        return true;
      }
    }
    return false;
  }

  // return online ids
  filterOnlineInList(userIds: string[]): string[] {
    const onlineList: { [key: string]: boolean } = {};
    const wsUsers: WsUserEntity[] = this.wsUserService.getAll();
    for (let i = 0; i < wsUsers.length; i++) {
      const onlineUid = wsUsers[i].userId;
      if (userIds.indexOf(onlineUid) > -1) {
        onlineList[onlineUid] = true;
      }
    }
    return Object.keys(onlineList);
  }

}
