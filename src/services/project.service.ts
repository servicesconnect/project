import {
  addDataToIndex,
  deleteIndexedData,
  getIndexedData,
  updateIndexedData,
} from "@project/config";
import {
  IRatingTypes,
  IReviewMessageDetails,
  ISellerDocument,
  ISellerProject,
} from "@project/interfaces";
import { projectsSearchBySellerId } from "@project/services";
import { ProjectModel } from "@project/models/project.schema";
import { publishDirectMessage } from "@project/queues/project.producer";
import { projectChannel } from "@project/server";
import { faker } from "@faker-js/faker";
import { sample } from "lodash";

const getProjectById = async (projectId: string): Promise<ISellerProject> => {
  const project: ISellerProject = await getIndexedData("projects", projectId);
  return project;
};

const getSellerProjects = async (
  sellerId: string
): Promise<ISellerProject[]> => {
  const resultsHits: ISellerProject[] = [];
  const projects = await projectsSearchBySellerId(sellerId, true);
  for (const item of projects.hits) {
    resultsHits.push(item._source as ISellerProject);
  }
  return resultsHits;
};

const getSellerPausedProjects = async (
  sellerId: string
): Promise<ISellerProject[]> => {
  const resultsHits: ISellerProject[] = [];
  const projects = await projectsSearchBySellerId(sellerId, false);
  for (const item of projects.hits) {
    resultsHits.push(item._source as ISellerProject);
  }
  return resultsHits;
};

const createProject = async (
  project: ISellerProject
): Promise<ISellerProject> => {
  const createdProject: ISellerProject = await ProjectModel.create(project);
  if (createdProject) {
    const data: ISellerProject = createdProject.toJSON?.() as ISellerProject;
    await publishDirectMessage(
      projectChannel,
      "servicesconnect-seller-update",
      "user-seller",
      JSON.stringify({
        type: "update-project-count",
        projectSellerId: `${data.sellerId}`,
        count: 1,
      }),
      "Details sent to users service."
    );
    await addDataToIndex("projects", `${createdProject._id}`, data);
  }
  return createdProject;
};

const deleteProject = async (
  projectId: string,
  sellerId: string
): Promise<void> => {
  await ProjectModel.deleteOne({ _id: projectId }).exec();
  await publishDirectMessage(
    projectChannel,
    "servicesconnect-seller-update",
    "user-seller",
    JSON.stringify({
      type: "update-project-count",
      projectSellerId: sellerId,
      count: -1,
    }),
    "Details sent to users service."
  );
  await deleteIndexedData("projects", `${projectId}`);
};

const updateProject = async (
  projectId: string,
  projectData: ISellerProject
): Promise<ISellerProject> => {
  const document: ISellerProject = (await ProjectModel.findOneAndUpdate(
    { _id: projectId },
    {
      $set: {
        title: projectData.title,
        description: projectData.description,
        categories: projectData.categories,
        subCategories: projectData.subCategories,
        tags: projectData.tags,
        price: projectData.price,
        coverImage: projectData.coverImage,
        expectedDelivery: projectData.expectedDelivery,
        basicTitle: projectData.basicTitle,
        basicDescription: projectData.basicDescription,
      },
    },
    { new: true }
  ).exec()) as ISellerProject;
  if (document) {
    const data: ISellerProject = document.toJSON?.() as ISellerProject;
    await updateIndexedData("projects", `${document._id}`, data);
  }
  return document;
};

const updateActiveProjectProp = async (
  projectId: string,
  projectActive: boolean
): Promise<ISellerProject> => {
  const document: ISellerProject = (await ProjectModel.findOneAndUpdate(
    { _id: projectId },
    {
      $set: {
        active: projectActive,
      },
    },
    { new: true }
  ).exec()) as ISellerProject;
  if (document) {
    const data: ISellerProject = document.toJSON?.() as ISellerProject;
    await updateIndexedData("projects", `${document._id}`, data);
  }
  return document;
};

const updateProjectReview = async (
  data: IReviewMessageDetails
): Promise<void> => {
  const ratingTypes: IRatingTypes = {
    "1": "one",
    "2": "two",
    "3": "three",
    "4": "four",
    "5": "five",
  };
  const ratingKey: string = ratingTypes[`${data.rating}`];
  const project = await ProjectModel.findOneAndUpdate(
    { _id: data.projectId },
    {
      $inc: {
        ratingsCount: 1,
        ratingSum: data.rating,
        [`ratingCategories.${ratingKey}.value`]: data.rating,
        [`ratingCategories.${ratingKey}.count`]: 1,
      },
    },
    { new: true, upsert: true }
  ).exec();
  if (project) {
    const data: ISellerProject = project.toJSON?.() as ISellerProject;
    await updateIndexedData("projects", `${project._id}`, data);
  }
};

const seedData = async (
  sellers: ISellerDocument[],
  count: string
): Promise<void> => {
  const categories: string[] = [
    "Graphics & Design",
    "Digital Marketing",
    "Writing & Translation",
    "Video & Animation",
    "Music & Audio",
    "Programming & Tech",
    "Data",
    "Business",
  ];
  const expectedDelivery: string[] = [
    "1 Day Delivery",
    "2 Days Delivery",
    "3 Days Delivery",
    "4 Days Delivery",
    "5 Days Delivery",
  ];
  const randomRatings = [
    { sum: 20, count: 4 },
    { sum: 10, count: 2 },
    { sum: 20, count: 4 },
    { sum: 15, count: 3 },
    { sum: 5, count: 1 },
  ];

  for (let i = 0; i < sellers.length; i++) {
    const sellerDoc: ISellerDocument = sellers[i];
    const title = `I will ${faker.word.words(5)}`;
    const basicTitle = faker.commerce.productName();
    const basicDescription = faker.commerce.productDescription();
    const rating = sample(randomRatings);
    const project: ISellerProject = {
      profilePicture: sellerDoc.profilePicture,
      sellerId: sellerDoc._id,
      email: sellerDoc.email,
      username: sellerDoc.username,
      title: title.length <= 80 ? title : title.slice(0, 80),
      basicTitle:
        basicTitle.length <= 40 ? basicTitle : basicTitle.slice(0, 40),
      basicDescription:
        basicDescription.length <= 100
          ? basicDescription
          : basicDescription.slice(0, 100),
      categories: `${sample(categories)}`,
      subCategories: [
        faker.commerce.department(),
        faker.commerce.department(),
        faker.commerce.department(),
      ],
      description: faker.lorem.sentences({ min: 2, max: 4 }),
      tags: [
        faker.commerce.product(),
        faker.commerce.product(),
        faker.commerce.product(),
        faker.commerce.product(),
      ],
      price: parseInt(faker.commerce.price({ min: 20, max: 30, dec: 0 })),
      coverImage: faker.image.urlPicsumPhotos(),
      expectedDelivery: `${sample(expectedDelivery)}`,
      sortId: parseInt(count, 10) + i + 1,
      ratingsCount: (i + 1) % 4 === 0 ? rating!["count"] : 0,
      ratingSum: (i + 1) % 4 === 0 ? rating!["sum"] : 0,
    };
    console.log(`***SEEDING PROJECT*** - ${i + 1} of ${count}`);
    await createProject(project);
  }
};

export {
  getProjectById,
  getSellerProjects,
  getSellerPausedProjects,
  createProject,
  deleteProject,
  updateProject,
  updateActiveProjectProp,
  updateProjectReview,
  seedData,
};
