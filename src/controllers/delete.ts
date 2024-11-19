import { deleteProject } from "@project/services";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const projectDelete = async (req: Request, res: Response): Promise<void> => {
  await deleteProject(req.params.projectId, req.params.sellerId);
  res.status(StatusCodes.OK).json({ message: "Project deleted successfully." });
};

export { projectDelete };
