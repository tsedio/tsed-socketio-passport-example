import {Constant, Inject} from "@tsed/di";
import {Unauthorized} from "@tsed/exceptions";
import {Logger} from "@tsed/logger";
import {Input, Nsp, Socket, SocketService} from "@tsed/socketio";
import passport from "passport";
import {Namespace, Server} from "socket.io";

import {User} from "../../../models/users/User.ts";
import {MiddlewareToWrap, wrapMiddleware} from "../utils/wrapMiddleware.ts";

@SocketService("/users")
export class UsersWS {
  @Nsp
  protected nsp: Namespace;

  @Inject(Server)
  protected io: Server;

  @Inject()
  protected logger: Logger;

  @Constant("session")
  protected session: MiddlewareToWrap;

  @Constant("passport")
  protected passportSettings: { userProperty: string; pauseStream: boolean | string };

  /**
   * Triggered the namespace is created
   */
  $onNamespaceInit(nsp: Namespace) {
    nsp.use(wrapMiddleware(this.session));
    nsp.use(wrapMiddleware(passport.initialize({userProperty: this.passportSettings.userProperty})));
    nsp.use(wrapMiddleware(passport.session({pauseStream: !!this.passportSettings.pauseStream})));
    nsp.use((socket, next) => {
      if ("user" in socket.request && socket.request.user) {
        next();
      } else {
        next(new Unauthorized("Unauthorized"));
      }
    });
  }

  $onConnection(@Socket socket: Socket & { request: { session: { id: string; socketId: string; save(): void } } }) {
    const session = socket.request.session;

    this.logger.info(`saving sid ${socket.id} in session ${session.id}`);
    session.socketId = socket.id;
    session.save();
  }

  @Input("whoami")
  whoami(@Socket socket: Socket & { request: { user: User } }) {
    this.logger.info(`whoami ${socket.id}`);
    return socket.request.user;
  }
}
