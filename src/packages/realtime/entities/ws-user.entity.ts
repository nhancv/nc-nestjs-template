import {InMemoryDBEntity} from "@nestjs-addons/in-memory-db";
import {SocketConn} from "../socket.connection";

export interface WsUserEntity extends InMemoryDBEntity {
  socketId: string;
  userId: string;
  connection: SocketConn;
  timestamp: number;
}
