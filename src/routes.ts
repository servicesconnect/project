import { verifyGatewayRequest } from "@project/config";
import { Application } from "express";
import { projectRoutes, healthRoutes } from "@project/routes/";

const BASE_PATH = "/api/v1/project";

const appRoutes = (app: Application): void => {
  app.use("", healthRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, projectRoutes());
};

export { appRoutes };
