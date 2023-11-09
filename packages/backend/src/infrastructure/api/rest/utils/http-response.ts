import { Utils } from '@sovi-tech/shared';
import { BadRequestError, HttpException, InternalServerError } from './http-exceptions';

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

export class HttpResponse {
  static error(error: Error): IHttpResponse {
    const httpResponse: IHttpResponse = {
      statusCode: InternalServerError.code,
      message: 'Erro interno no servidor.',
      error: {
        type: InternalServerError.name,
        message: 'Contate o administrador do sistema.',
      },
    };

    if (error instanceof HttpException && httpResponse.error) {
      httpResponse.message = error.message;
      httpResponse.statusCode = error.code;
      httpResponse.error.type = error.name;
      httpResponse.error.message = error.error?.message || error.message;
    }

    if (Utils.Environment.instance.env?.NODE_ENV === 'development' && httpResponse.error) {
      if (httpResponse.statusCode === BadRequestError.code) {
        const message = httpResponse.message?.concat(
          ' ',
          'Desculpe, ocorreu um erro na solicitação. Parece que os dados enviados não estão corretos. Verifique os dados fornecidos e tente novamente.',
        );
        httpResponse.message = message as string;
      }

      if (httpResponse.statusCode === InternalServerError.code) {
        httpResponse.message = 'Aconteceu uma bagunçinha no back.';
        httpResponse.error.message = error.message;
      }
    }

    return httpResponse;
  }
}
