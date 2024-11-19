import { projectUpdateSchema } from "@project/config";
import { updateActiveProjectProp, updateProject } from "@project/services";
import { BadRequestError, isDataURL } from "@project/config";
import { cloudinaryConfig } from "@project/config";
import { ISellerProject } from "@project/interfaces";
import { UploadApiResponse } from "cloudinary";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const projectUpdate = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(
    projectUpdateSchema.validate(req.body)
  );
  if (error?.details) {
    throw new BadRequestError(
      error.details[0].message,
      "Update project() method"
    );
  }
  const isDataUrl = isDataURL(req.body.coverImage);
  let coverImage = "";
  if (isDataUrl) {
    const result: UploadApiResponse = (await cloudinaryConfig.uploads(
      req.body.coverImage
    )) as UploadApiResponse;
    if (!result.public_id) {
      throw new BadRequestError(
        "File upload error. Try again.",
        "Update project() method"
      );
    }
    coverImage = result?.secure_url;
  } else {
    coverImage = req.body.coverImage;
  }
  const project: ISellerProject = {
    title: req.body.title,
    description: req.body.description,
    categories: req.body.categories,
    subCategories: req.body.subCategories,
    tags: req.body.tags,
    price: req.body.price,
    expectedDelivery: req.body.expectedDelivery,
    basicTitle: req.body.basicTitle,
    basicDescription: req.body.basicDescription,
    coverImage,
  };
  const updatedProject: ISellerProject = await updateProject(
    req.params.projectId,
    project
  );
  res.status(StatusCodes.OK).json({
    message: "Project updated successfully.",
    project: updatedProject,
  });
};

const projectUpdateActive = async (
  req: Request,
  res: Response
): Promise<void> => {
  const updatedProject: ISellerProject = await updateActiveProjectProp(
    req.params.projectId,
    req.body.active
  );
  res.status(StatusCodes.OK).json({
    message: "Project updated successfully.",
    project: updatedProject,
  });
};

export { projectUpdate, projectUpdateActive };
