import { HttpRequestType, IHttpResponse } from "./http-route";

export type RequestHandlerType<Body, Params, Query, OutputData> = (
  request: HttpRequestType<Body, Params, Query>
) => Promise<IHttpResponse>;

export interface IController<OutputData = unknown> {
  handler: <T>(data?: T) => Promise<IHttpResponse<OutputData>>;
}
