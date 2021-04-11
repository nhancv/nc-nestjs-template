import * as SocketIO from 'socket.io';
import {JwtPayload} from "../../collections/auth/jwt.payload";

export interface SocketConn extends SocketIO.Socket {
  conn: SocketIO.EngineSocket & {
    jwtToken: string;
    payload: JwtPayload;
    userId: string;
    memoryId: string;
  };
}
