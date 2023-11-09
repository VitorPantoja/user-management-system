import { type FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';

export default class Helmet {
  constructor(app: FastifyInstance) {
    app.register(helmet);
  }
}
