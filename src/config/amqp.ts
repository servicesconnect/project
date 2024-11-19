import { envConfig, winstonLogger } from "@project/config";
import client, { Channel, Connection } from "amqplib";
import { Logger } from "winston";

const log: Logger = winstonLogger("usersQueueConnection", "debug");

async function createQueueConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(
      `${envConfig.rabbitmq_endpoint}`
    );
    const channel: Channel = await connection.createChannel();
    log.info("Project server connected to queue successfully...");
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log("error", "ProjectService error createConnection() method:", error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: Connection): void {
  process.once("SIGINT", async () => {
    await channel.close();
    await connection.close();
  });
}

export { createQueueConnection };
