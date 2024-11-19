import { winstonLogger } from "./logger";
import { Logger } from "winston";
import { envConfig } from "./env";
import mongoose from "mongoose";

const log: Logger = winstonLogger("projectsDatabaseServer", "debug");

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${envConfig.database_url}`);
    log.info("Project service successfully connected to database.");
  } catch (error) {
    log.log(
      "error",
      "ProjectService databaseConnection() method error:",
      error
    );
  }
};

export { databaseConnection };
