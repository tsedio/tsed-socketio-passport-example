import {PlatformContext, Provider} from "@tsed/common";
import {ancestorsOf} from "@tsed/core";
import {OverrideProvider} from "@tsed/di";
import {Unauthorized} from "@tsed/exceptions";
import {PassportException, ProtocolsService} from "@tsed/passport";
import {Context} from "@tsed/platform-params";
import Passport from "passport";
import {promisify} from "util";


export class PassportMessage extends Unauthorized {
  constructor(message: string, public opts: Record<string, unknown> = {}) {
    super(message);
  }
}

/**
 * @ignore
 */
@OverrideProvider(ProtocolsService)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export class CustomProtocolService extends ProtocolsService {
  /**
   * Call passport authenticate or authorize depending on the chosen method.
   * @param method
   * @param protocols
   * @param options
   * @param ctx
   * @private
   */
  private override async call(
    method: "authenticate" | "authorize",
    protocols: string | string[],
    options: Record<string, unknown>,
    ctx: PlatformContext
  ) {
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    protocols = ([] as string[]).concat(protocols);

    if (protocols.length === 0) {
      throw new Unauthorized("Not authorized");
    }

    try {
      options.failWithError = true;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const fn = promisify(Passport[method](protocols.length === 1 ? protocols[0] : protocols, options));

      await fn(request, response);
    } catch (er) {
      if (!ancestorsOf(er).includes(Error)) {
        throw new PassportException(er);
      }
      throw er;
    }
  }

  /**
   * Create the verifier handler for passport
   * @param provider
   * @private
   */
  private override createHandler(provider: Provider) {
    const middleware = this.platformHandler.createCustomHandler(provider, "$onVerify");

    return async (req: { $ctx: Context }, ...args: unknown[]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const done: (err: Error | null, data: boolean | object, {}) => void = args[args.length - 1];

      if (req.$ctx) {
        req.$ctx.set("PROTOCOL_ARGS", args.slice(0, -1));

        try {
          await middleware(req.$ctx);

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          done(null, ...[].concat(req.$ctx.data));
        } catch (err) {
          if (err instanceof PassportMessage) {
            done(null, false, {...err.opts, message: err.message});
          } else {
            done(err, false, {message: err.message});
          }
        }
      } else {
        done(new Error("Headers already sent"), false, {message: "Headers already sent"});
      }
    };
  }
}
