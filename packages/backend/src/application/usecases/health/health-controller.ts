import { IController } from "../../../infrastructure/api/rest/http-controller";
import { IHttpResponse } from "../../../infrastructure/api/rest/http-route";
import { HealthUseCase } from "./health-use-case";

interface IHealthControllerResponse {
  uptime: string;
}

export class HealthController
  implements IController<IHealthControllerResponse>
{
  healthUseCase: HealthUseCase;

  constructor(healthUseCase: HealthUseCase) {
    this.healthUseCase = healthUseCase;
  }

  async handler(): Promise<IHttpResponse<IHealthControllerResponse>> {
    const uptime = await this.healthUseCase.execute();

    return {
      statusCode: 200,
      message: "Serviço disponível",
      data: {
        uptime,
      },
    };
  }
}
