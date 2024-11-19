import { createQueueConnection, winstonLogger } from "@project/config";
import { Channel } from "amqplib";
import { Logger } from "winston";

const log: Logger = winstonLogger("projectServiceProducer", "debug");

const publishDirectMessage = async (
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createQueueConnection()) as Channel;
    }
    await channel.assertExchange(exchangeName, "direct");
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log(
      "error",
      "ProjectService publishDirectMessage() method error:",
      error
    );
  }
};

export { publishDirectMessage };
