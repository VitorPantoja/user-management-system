import { type HttpRoute } from "./http-route";

export interface HttpServer<Application> {
  app: Application;
  listen: (port: number) => Promise<void>;
  close: () => Promise<void>;
  addRoute: <Body, Params, Query>(
    route: HttpRoute<Body, Params, Query>
  ) => Promise<void>;
}
