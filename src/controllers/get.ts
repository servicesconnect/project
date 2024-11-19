import { getUserSelectedProjectCategory } from "@project/redis/project.cache";
import {
  getProjectById,
  getSellerProjects,
  getSellerPausedProjects,
} from "@project/services/project.service";
import {
  getMoreProjectsLikeThis,
  getTopRatedProjectsByCategory,
  projectsSearchByCategory,
} from "@project/services/search.service";
import { ISearchResult, ISellerProject } from "@project/interfaces";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const projectById = async (req: Request, res: Response): Promise<void> => {
  const project: ISellerProject = await getProjectById(req.params.projectId);
  res.status(StatusCodes.OK).json({ message: "Get project by id", project });
};

const sellerProjects = async (req: Request, res: Response): Promise<void> => {
  const projects: ISellerProject[] = await getSellerProjects(
    req.params.sellerId
  );
  res.status(StatusCodes.OK).json({ message: "Seller projects", projects });
};

const sellerInactiveProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  const projects: ISellerProject[] = await getSellerPausedProjects(
    req.params.sellerId
  );
  res.status(StatusCodes.OK).json({ message: "Seller projects", projects });
};

const topRatedProjectsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const category = await getUserSelectedProjectCategory(
    `selectedCategories:${req.params.username}`
  );
  const resultHits: ISellerProject[] = [];
  const projects: ISearchResult = await getTopRatedProjectsByCategory(
    `${category}`
  );
  for (const item of projects.hits) {
    resultHits.push(item._source as ISellerProject);
  }
  res.status(StatusCodes.OK).json({
    message: "Search top projects results",
    total: projects.total,
    projects: resultHits,
  });
};

const projectsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const category = await getUserSelectedProjectCategory(
    `selectedCategories:${req.params.username}`
  );
  const resultHits: ISellerProject[] = [];
  const projects: ISearchResult = await projectsSearchByCategory(`${category}`);
  for (const item of projects.hits) {
    resultHits.push(item._source as ISellerProject);
  }
  res.status(StatusCodes.OK).json({
    message: "Search projects category results",
    total: projects.total,
    projects: resultHits,
  });
};

const moreLikeThis = async (req: Request, res: Response): Promise<void> => {
  const resultHits: ISellerProject[] = [];
  const projects: ISearchResult = await getMoreProjectsLikeThis(
    req.params.projectId
  );
  for (const item of projects.hits) {
    resultHits.push(item._source as ISellerProject);
  }
  res.status(StatusCodes.OK).json({
    message: "More projects like this result",
    total: projects.total,
    projects: resultHits,
  });
};

export {
  projectById,
  sellerProjects,
  sellerInactiveProjects,
  topRatedProjectsByCategory,
  projectsByCategory,
  moreLikeThis,
};
