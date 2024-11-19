import { databaseConnection, cloudinaryConfig } from "@project/config";
import express, { Express } from "express";
import { start } from "@project/server";
import { redisConnect } from "@project/redis";

const initilize = (): void => {
  cloudinaryConfig.cloudinaryConfig();
  databaseConnection();
  const app: Express = express();
  start(app);
  redisConnect();
};

initilize();
