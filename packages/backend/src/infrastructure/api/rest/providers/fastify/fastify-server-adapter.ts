import fastify, { FastifyInstance } from 'fastify';
import { HttpRoute } from '../../http-route';
import { HttpServer } from '../../http-server';
import { FastifyRouteAdapter } from './fastify-route-adapter';
import { Utils } from '@sovi-tech/shared';
import CatchError from './middlewares/catch-error';
import Helmet from './middlewares/helmet';
import Cors from './middlewares/cors';
import RateLimit from './middlewares/rate-limite';

export class FastifyServerAdapter implements HttpServer<FastifyInstance> {
  app: FastifyInstance;
  private routeCounter?: number = 0;

  constructor() {
    this.app = fastify();

    new Helmet(this.app);
    new Cors(this.app);
    new CatchError(this.app);
    new RateLimit(this.app);
  }

  async listen(port: number): Promise<void> {
    await new Promise((resolve, reject) => {
      this.app.listen({ port }, error => {
        if (error) {
          reject(error);
          return;
        }

        resolve(undefined);
      });
    });

    Utils.TerminalLogger.log(`🚦 Rotas adicionadas: ${this.routeCounter}`);
    this.routeCounter = undefined;

    Utils.TerminalLogger.log(`🚩 Ambiente: ${Utils.Environment.instance.env?.NODE_ENV}`);
  }

  async close(): Promise<void> {
    await this.app.close();
  }

  async addRoute<Body, Params, Query>(route: HttpRoute<Body, Params, Query>): Promise<void> {
    this.app.register(FastifyRouteAdapter.execute(route), { prefix: '/v1' });
    this.routeCounter = this.routeCounter ? this.routeCounter + 1 : 1;
  }
}
