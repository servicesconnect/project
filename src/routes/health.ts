import { health } from "@project/controllers";
import express, { Router } from "express";

const router: Router = express.Router();

const healthRoutes = (): Router => {
  router.get("/project-health", health);

  return router;
};

export { healthRoutes };
