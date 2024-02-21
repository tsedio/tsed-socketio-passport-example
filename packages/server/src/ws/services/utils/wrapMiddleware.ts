import {IncomingMessage} from "http";
import {Socket} from "socket.io";

export type MiddlewareToWrap = (req: IncomingMessage, res: object, next: (err?: Error) => void) => void;
export const wrapMiddleware = (middleware: MiddlewareToWrap) =>
  (socket: Socket, next: (err?: Error) => void) => middleware(socket.request, {}, next);
