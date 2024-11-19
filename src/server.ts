import http from "http";

import "express-async-errors";
import {
  CustomError,
  envConfig,
  IErrorResponse,
  winstonLogger,
  startAndCheckElasticConnection,
  createIndex,
  createQueueConnection,
} from "@project/config";
import { IAuthPayload } from "@project/interfaces";
import { Logger } from "winston";

import {
  Application,
  Request,
  Response,
  NextFunction,
  json,
  urlencoded,
} from "express";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import { verify } from "jsonwebtoken";
import compression from "compression";
// import { appRoutes } from "@project/routes";
import { Channel } from "amqplib";
import {
  consumeProjectDirectMessage,
  consumeSeedDirectMessages,
} from "./queues/project.consumer";
// import {
//   consumeProjectDirectMessage,
//   consumeSeedDirectMessages,
// } from "@project/queues/project.consumer";

const SERVER_PORT = 4004;
const log: Logger = winstonLogger("projectServer", "debug");
let projectChannel: Channel;

const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  //   routesMiddleware(app);
  startQueues();
  startElasticSearch();
  projectErrorHandler(app);
  startServer(app);
};

const securityMiddleware = (app: Application): void => {
  app.set("trust proxy", 1);
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: envConfig.api_gateway_url,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
  );
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const payload: IAuthPayload = verify(
        token,
        envConfig.jwt_token!
      ) as IAuthPayload;
      req.currentUser = payload;
    }
    next();
  });
};

const standardMiddleware = (app: Application): void => {
  app.use(compression());
  app.use(json({ limit: "200mb" }));
  app.use(urlencoded({ extended: true, limit: "200mb" }));
};

// const routesMiddleware = (app: Application): void => {
//   appRoutes(app);
// };

const startQueues = async (): Promise<void> => {
  projectChannel = (await createQueueConnection()) as Channel;
  await consumeProjectDirectMessage(projectChannel);
  await consumeSeedDirectMessages(projectChannel);
};

const startElasticSearch = (): void => {
  startAndCheckElasticConnection();
  createIndex("projects");
};

const projectErrorHandler = (app: Application): void => {
  app.use(
    (
      error: IErrorResponse,
      _req: Request,
      res: Response,
      next: NextFunction
    ) => {
      log.log("error", `ProjectService ${error.comingFrom}:`, error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    }
  );
};

const startServer = (app: Application): void => {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Project server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Project server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log("error", "ProjectService startServer() method error:", error);
  }
};

export { start, projectChannel };
