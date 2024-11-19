import {
  projectCreateSchema,
  BadRequestError,
  cloudinaryConfig,
} from "@project/config";
import { Request, Response } from "express";
import { projectCreate } from "@project/controllers/create";
import {} from "@project/config";
import * as projectService from "@project/services/project.service";
import {
  authUserPayload,
  projectMockRequest,
  projectMockResponse,
  sellerProject,
} from "@project/controllers/test/mocks/project.mock";

jest.mock("@project/services");
jest.mock("@project/config/validators");
jest.mock("@project/config/error-handler");
jest.mock("@project/config/elasticsearch");
jest.mock("@project/config/helpers");
jest.mock("@project/interfaces");
jest.mock("@elastic/elasticsearch");

describe("Project Controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("project method", () => {
    it("should throw an error for invalid schema data", () => {
      const req: Request = projectMockRequest(
        {},
        sellerProject,
        authUserPayload
      ) as unknown as Request;
      const res: Response = projectMockResponse();
      jest.spyOn(projectCreateSchema, "validate").mockImplementation((): any =>
        Promise.resolve({
          error: {
            name: "ValidationError",
            isJoi: true,
            details: [{ message: "This is an error message" }],
          },
        })
      );

      projectCreate(req, res).catch(() => {
        expect(BadRequestError).toHaveBeenCalledWith(
          "This is an error message",
          "Create project() method"
        );
      });
    });

    it("should throw file upload error", () => {
      const req: Request = projectMockRequest(
        {},
        sellerProject,
        authUserPayload
      ) as unknown as Request;
      const res: Response = projectMockResponse();
      jest
        .spyOn(projectCreateSchema, "validate")
        .mockImplementation((): any => Promise.resolve({ error: {} }));
      jest
        .spyOn(cloudinaryConfig, "uploads")
        .mockImplementation((): any => Promise.resolve({ public_id: "" }));

      projectCreate(req, res).catch(() => {
        expect(BadRequestError).toHaveBeenCalledWith(
          "File upload error. Try again.",
          "Create project() method"
        );
      });
    });

    it("should create a new project and return the correct response", async () => {
      const req: Request = projectMockRequest(
        {},
        sellerProject,
        authUserPayload
      ) as unknown as Request;
      const res: Response = projectMockResponse();
      jest
        .spyOn(projectCreateSchema, "validate")
        .mockImplementation((): any => Promise.resolve({ error: {} }));
      jest
        .spyOn(cloudinaryConfig, "uploads")
        .mockImplementation((): any =>
          Promise.resolve({ public_id: "123456" })
        );
      jest
        .spyOn(projectService, "createProject")
        .mockResolvedValue(sellerProject);

      await projectCreate(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});
