import {
  getDocumentCount,
  BadRequestError,
  projectCreateSchema,
  cloudinaryConfig,
} from "@project/config";
import { createProject } from "@project/services";
import { ISellerProject } from "@project/interfaces";
import { UploadApiResponse } from "cloudinary";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const projectCreate = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(
    projectCreateSchema.validate(req.body)
  );
  if (error?.details) {
    throw new BadRequestError(
      error.details[0].message,
      "Create project() method"
    );
  }
  const result: UploadApiResponse = (await cloudinaryConfig.uploads(
    req.body.coverImage
  )) as UploadApiResponse;
  if (!result.public_id) {
    throw new BadRequestError(
      "File upload error. Try again.",
      "Create project() method"
    );
  }
  const count: number = await getDocumentCount("projects");
  const project: ISellerProject = {
    sellerId: req.body.sellerId,
    username: req.currentUser!.username,
    email: req.currentUser!.email,
    profilePicture: req.body.profilePicture,
    title: req.body.title,
    description: req.body.description,
    categories: req.body.categories,
    subCategories: req.body.subCategories,
    tags: req.body.tags,
    price: req.body.price,
    expectedDelivery: req.body.expectedDelivery,
    basicTitle: req.body.basicTitle,
    basicDescription: req.body.basicDescription,
    coverImage: `${result?.secure_url}`,
    sortId: count + 1,
  };
  const createdProject: ISellerProject = await createProject(project);
  res.status(StatusCodes.CREATED).json({
    message: "Project created successfully.",
    project: createdProject,
  });
};

export { projectCreate };
