import { Utils } from '@sovi-tech/shared';
import { HttpRequestType, HttpRoute } from '../../http-route';
import { type FastifyInstance } from 'fastify';
import { LoggerLevel } from '@sovi-tech/shared/src/utils/terminal-logger';

type Options = {
  prefix: string;
};

type Done = (err?: Error | undefined) => void;

export class FastifyRouteAdapter {
  static execute<Body, Params, Query>(route: HttpRoute) {
    return (fastifyInstance: FastifyInstance, _options: Options, done: Done) => {
      fastifyInstance[route.method](route.path, async (request, reply) => {
        const routeRequest: HttpRequestType<Body, Params, Query> = {
          headers: request.headers,
          body: request.body as Body,
          params: request.params as Params,
          query: request.query as Query,
          method: request.method,
          url: request.url,
        };

        await route.handle(routeRequest, {
          send: data => {
            let level: LoggerLevel;

            if (data.statusCode >= 400 && data.statusCode < 500) {
              level = 'WARN';
            } else if (data.statusCode >= 500) {
              level = 'ERROR';
            } else if (data.statusCode >= 200 && data.statusCode < 300) {
              level = 'SUCCESS';
            } else {
              level = 'DEBUG';
            }

            Utils.TerminalLogger.log(
              `[${data.statusCode}] ${route.method.toUpperCase()} ${route.path}`,
              {
                level,
                scope: 'HTTP',
              },
              JSON.stringify(routeRequest),
            );

            reply.status(data.statusCode).send(data);
          },
        });
      });

      done();
    };
  }
}
