import { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

export default class Cors {
  constructor(app: FastifyInstance) {
    app.register(cors);
  }
}
