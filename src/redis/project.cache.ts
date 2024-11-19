import { winstonLogger } from "@project/config";
import { Logger } from "winston";
import { client } from "@project/redis/";

const log: Logger = winstonLogger("projectCache", "debug");

const getUserSelectedProjectCategory = async (key: string): Promise<string> => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    const response: string = (await client.GET(key)) as string;
    return response;
  } catch (error) {
    log.log(
      "error",
      "ProjectService ProjectCache getUserSelectedProjectCategory() method error:",
      error
    );
    return "";
  }
};

export { getUserSelectedProjectCategory };
