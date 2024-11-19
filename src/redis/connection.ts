import { envConfig, winstonLogger } from "@project/config";
import { createClient } from "redis";
import { Logger } from "winston";

type RedisClient = ReturnType<typeof createClient>;
const log: Logger = winstonLogger("projectRedisConnection", "debug");
const client: RedisClient = createClient({ url: `${envConfig.redis_host}` });

const redisConnect = async (): Promise<void> => {
  try {
    await client.connect();
    log.info(`ProjectService Redis Connection: ${await client.ping()}`);
    cacheError();
  } catch (error) {
    log.log("error", "ProjectService redisConnect() method error:", error);
  }
};

const cacheError = (): void => {
  client.on("error", (error: unknown) => {
    log.error(error);
  });
};

export { redisConnect, client };
