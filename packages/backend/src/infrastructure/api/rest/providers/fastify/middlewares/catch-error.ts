import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import { InternalServerError } from '../../../utils/http-exceptions';
import { HttpResponse } from '../../../utils/http-response';
import { Utils } from '@sovi-tech/shared';

export default class CatchError {
  constructor(app: FastifyInstance) {
    app.setErrorHandler((error, request: FastifyRequest, reply: FastifyReply) => {
      const httpResponse = HttpResponse.error(error);

      if (httpResponse.statusCode >= InternalServerError.code) {
        Utils.TerminalLogger.log(
          `[${InternalServerError.code}] ${request.method.toUpperCase()} ${request.routeOptions.url}`,
          {
            scope: 'API',
            level: 'ERROR',
          },
          `Route: ${request.url}`,
          `\nRequest: ${JSON.stringify({
            body: request.body,
            params: request.params,
            query: request.query,
            headers: request.headers,
          })}`,
          `\nStack: ${error.stack}`,
        );
      }

      return reply.status(httpResponse.statusCode).send(httpResponse);
    });
  }
}
