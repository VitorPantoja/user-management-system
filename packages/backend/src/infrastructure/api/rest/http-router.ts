import { healthRoute } from '../../../application/usecases/health';
import { HttpServer } from './http-server';

export class HttpRouter<Application> {
  httpServer: HttpServer<Application>;

  constructor(httpServer: HttpServer<Application>) {
    this.httpServer = httpServer;
  }

  async load() {
    this.httpServer.addRoute(healthRoute);
  }
}
