import {Get} from "@tsed/common";
import {Controller, Inject} from "@tsed/di";
import {Context} from "@tsed/platform-params";
import {Hidden, Post, Returns} from "@tsed/schema";
import {Server} from "socket.io";

import {User} from "../../../models/users/User.ts";

@Hidden()
@Controller("/")
export class LogoutController {
  @Inject()
  protected io: Server;

  @Post("/logout")
  @Get("/logout")
  @Returns(302, User).Groups("credentials")
  @Returns(400).Description("Validation error")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async logout(@Context() $ctx: Context) {

    const socketId = $ctx.request.session.socketId;

    if (socketId && this.io.of("/users").sockets.get(socketId)) {
      this.io.of("/users").sockets.get(socketId)!.disconnect(true);
    }

    await new Promise(resolve => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ($ctx.getReq() as any).logout(resolve);
    });

    $ctx.response.cookie("connect.sid", "", {expires: new Date()});

    return $ctx.response.redirect(302, "/");
  }
}
