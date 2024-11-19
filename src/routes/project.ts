import {
  projectCreate,
  projectDelete,
  projectById,
  projectsByCategory,
  moreLikeThis,
  sellerProjects,
  sellerInactiveProjects,
  topRatedProjectsByCategory,
  projects,
  projectUpdate,
  projectUpdateActive,
  project,
} from "@project/controllers";
import express, { Router } from "express";

const router: Router = express.Router();

const projectRoutes = (): Router => {
  router.get("/:projectId", projectById);
  router.get("/seller/:sellerId", sellerProjects);
  router.get("/seller/pause/:sellerId", sellerInactiveProjects);
  router.get("/search/:from/:size/:type", projects);
  router.get("/category/:username", projectsByCategory);
  router.get("/top/:username", topRatedProjectsByCategory);
  router.get("/similar/:projectId", moreLikeThis);
  router.post("/create", projectCreate);
  router.put("/:projectId", projectUpdate);
  router.put("/active/:projectId", projectUpdateActive);
  router.put("/seed/:count", project);
  router.delete("/:projectId/:sellerId", projectDelete);

  return router;
};

export { projectRoutes };
