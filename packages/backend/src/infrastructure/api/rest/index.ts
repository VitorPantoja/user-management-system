import { HttpRouter } from "./http-router";
import { FastifyServerAdapter } from "./providers/fastify/fastify-server-adapter";

const httpServer = new FastifyServerAdapter();
const httpRouter = new HttpRouter(httpServer);

export { httpServer, httpRouter };
