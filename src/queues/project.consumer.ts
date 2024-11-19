import { winstonLogger, createQueueConnection } from "@project/config";
import { Channel, ConsumeMessage, Replies } from "amqplib";
import { Logger } from "winston";
import {
  seedData,
  updateProjectReview,
} from "@project/services/project.service";

const log: Logger = winstonLogger("projectServiceConsumer", "debug");

const consumeProjectDirectMessage = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createQueueConnection()) as Channel;
    }
    const exchangeName = "servicesconnect-update-project";
    const routingKey = "update-project";
    const queueName = "project-update-queue";
    await channel.assertExchange(exchangeName, "direct");
    const servicesconnectQueue: Replies.AssertQueue = await channel.assertQueue(
      queueName,
      { durable: true, autoDelete: false }
    );
    await channel.bindQueue(
      servicesconnectQueue.queue,
      exchangeName,
      routingKey
    );
    channel.consume(
      servicesconnectQueue.queue,
      async (msg: ConsumeMessage | null) => {
        const { projectReview } = JSON.parse(msg!.content.toString());
        await updateProjectReview(JSON.parse(projectReview));
        channel.ack(msg!);
      }
    );
  } catch (error) {
    log.log(
      "error",
      "ProjectService ProjectConsumer consumeProjectDirectMessage() method error:",
      error
    );
  }
};

const consumeSeedDirectMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createQueueConnection()) as Channel;
    }
    const exchangeName = "servicesconnect-seed-project";
    const routingKey = "receive-sellers";
    const queueName = "seed-project-queue";
    await channel.assertExchange(exchangeName, "direct");
    const servicesconnectQueue: Replies.AssertQueue = await channel.assertQueue(
      queueName,
      { durable: true, autoDelete: false }
    );
    await channel.bindQueue(
      servicesconnectQueue.queue,
      exchangeName,
      routingKey
    );
    channel.consume(
      servicesconnectQueue.queue,
      async (msg: ConsumeMessage | null) => {
        const { sellers, count } = JSON.parse(msg!.content.toString());
        await seedData(sellers, count);
        channel.ack(msg!);
      }
    );
  } catch (error) {
    log.log(
      "error",
      "ProjectService ProjectConsumer consumeProjectDirectMessage() method error:",
      error
    );
  }
};

export { consumeProjectDirectMessage, consumeSeedDirectMessages };
