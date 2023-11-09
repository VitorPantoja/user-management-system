import { HttpRoute } from "../../../infrastructure/api/rest/http-route";
import { HealthController } from "./health-controller";
import { HealthUseCase } from "./health-use-case";

const healthUseCase = new HealthUseCase();

const healthController = new HealthController(healthUseCase);

const healthRoute = new HttpRoute("/health", "get", {
  controller: healthController,
});

export { healthRoute };
