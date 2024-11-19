import { ObjectId } from "mongoose";
import { IRatingCategories, IReviewDocument } from "./review.interface";
import { ISellerDocument } from "./seller.interface";

export type ProjectType = string | string[] | number | unknown | undefined;

export interface ICreateProject extends Record<string, ProjectType> {
  // [key: string]: string | string[] | number | undefined;
  sellerId?: string;
  profilePicture?: string;
  title: string;
  categories: string;
  description: string;
  subCategories: string[];
  tags: string[];
  price: number;
  coverImage: string;
  expectedDelivery: string;
  basicTitle: string;
  basicDescription: string;
}

export interface ISellerProject {
  _id?: string | ObjectId;
  // this "id" property is used because elastcisearch does not accept a key with an underscore "_id"
  // elasticsearch has _id as a reserved field name
  id?: string | ObjectId;
  sellerId?: string | ObjectId;
  title: string;
  username?: string;
  profilePicture?: string;
  email?: string;
  description: string;
  active?: boolean;
  categories: string;
  subCategories: string[];
  tags: string[];
  ratingsCount?: number; // make sure to add this to elasticsearch as a double
  ratingSum?: number; // make sure to add this to elasticsearch as a double
  ratingCategories?: IRatingCategories;
  expectedDelivery: string;
  basicTitle: string;
  basicDescription: string;
  price: number;
  coverImage: string;
  createdAt?: Date | string;
  sortId?: number;
  // this is added here because we will use the json format of the document
  // at some point instead of the Mongoose document
  // the json object which will contain the virtual field "id" without the field "_id" will be added to elasticsearch
  // because "_id" is a reserved field name in elasticsearch.
  toJSON?: () => unknown;
}

export interface IProjectContext {
  project: ISellerProject;
  seller: ISellerDocument;
  isSuccess?: boolean;
  isLoading?: boolean;
}

export interface IProjectsProps {
  type?: string;
  project?: ISellerProject;
}

export interface IProjectCardItems {
  project: ISellerProject;
  linkTarget: boolean;
  showEditIcon: boolean;
}

export interface ISelectedBudget {
  minPrice: string;
  maxPrice: string;
}

export interface IProjectViewReviewsProps {
  showRatings: boolean;
  reviews?: IReviewDocument[];
}

export interface IProjectInfo {
  total: number | string;
  title: string;
  bgColor: string;
}

export interface IProjectTopProps {
  projects: ISellerProject[];
  title?: string;
  subTitle?: string;
  category?: string;
  width: string;
  type: string;
}
