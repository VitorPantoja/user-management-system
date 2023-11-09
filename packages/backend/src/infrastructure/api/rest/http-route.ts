import { type IncomingMessage } from 'http';
import { IDataValidator } from '../../external-services/validator/validator';
import { IController } from './http-controller';
import { BadRequestError } from './utils/http-exceptions';

type ResponseErrorType = {
  type: string;
  message: string;
};

type PaginationType = {
  page: number;
  limit: number;
  total: number;
};

export interface IHttpResponse<T = unknown> {
  statusCode: number;
  data?: T | null;
  message?: string;
  pagination?: PaginationType;
  error?: ResponseErrorType;
}

export type HttpRequestType<Body, Params, Query> = Pick<IncomingMessage, 'headers' | 'method' | 'url'> & {
  body?: Body;
  params?: Params;
  query?: Query;
};

export type RequestMethods = 'get' | 'post' | 'put' | 'delete';

export type Schema<Body, Params, Query> = Pick<HttpRequestType<Body, Params, Query>, 'body' | 'params' | 'query'>;

type HttpRoutePropsKeys<Body = unknown, Params = unknown, Query = unknown> = keyof HttpRequestType<Body, Params, Query>;

export type HttpResponseType<T = unknown> = {
  send: (data: IHttpResponse<T>) => void;
};

type HttpRouteProps<Body, Params, Query> = {
  controller: IController;
  validation?: {
    schema: Schema<Body, Params, Query>;
    validator: IDataValidator;
  };
};

export class HttpRoute<Body = unknown, Params = unknown, Query = unknown> {
  path: string;
  method: RequestMethods;
  props: HttpRouteProps<Body, Params, Query>;

  constructor(path: string, method: RequestMethods, props: HttpRouteProps<Body, Params, Query>) {
    this.path = path;
    this.method = method;
    this.props = props;
  }

  async validate(request: HttpRequestType<Body, Params, Query>) {
    if (!this.props.validation) return;

    const entries = Object.entries(this.props.validation.schema);

    for (const [key, schema] of entries) {
      const requestData = request[key as HttpRoutePropsKeys];

      if (!requestData) continue;

      const { isValid, message, data } = await this.props.validation.validator.validate(requestData, schema);

      if (!isValid || !data) {
        throw new BadRequestError('Falha na validação dos dados', new Error(message));
      }
    }
  }

  async handle(request: HttpRequestType<Body, Params, Query>, response: HttpResponseType): Promise<void> {
    await this.validate(request);

    const result = await this.props.controller.handler();

    response.send(result);
  }
}
