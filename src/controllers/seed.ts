import { publishDirectMessage } from "@project/queues/project.producer";
import { projectChannel } from "@project/server";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const project = async (req: Request, res: Response): Promise<void> => {
  const { count } = req.params;
  await publishDirectMessage(
    projectChannel,
    "servicesconnect-project",
    "get-sellers",
    JSON.stringify({ type: "getSellers", count }),
    "Project seed message sent to user service."
  );
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Project created successfully" });
};

export { project };
