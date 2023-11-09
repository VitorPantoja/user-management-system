import rateLimit from "@fastify/rate-limit";
import { type FastifyInstance, type FastifyRequest } from "fastify";
import { TooManyRequestError } from "../../../utils/http-exceptions";

export default class RateLimit {
  constructor(app: FastifyInstance) {
    app.register(rateLimit, {
      global: true,
      max: 10,
      timeWindow: "1 minute",
      errorResponseBuilder: (_request, _context) => {
        return new TooManyRequestError("Muitas requisições.");
      },
      keyGenerator: (request: FastifyRequest) => {
        const { ip, url, routeOptions } = request;

        return `${url}-${ip}-${routeOptions.url}`;
      },
    });
  }
}
