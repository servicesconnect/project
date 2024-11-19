import { Client } from "@elastic/elasticsearch";
import {
  ClusterHealthResponse,
  CountResponse,
  GetResponse,
} from "@elastic/elasticsearch/lib/api/types";
import { envConfig, winstonLogger } from "@project/config";
import { ISellerProject } from "@project/interfaces";
import { Logger } from "winston";

const log: Logger = winstonLogger("ProjectsElasticSearchServer", "debug");

const elasticSearchClient = new Client({
  node: `${envConfig.elastic_search_url}`,
});

async function startAndCheckElasticConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    log.info("ProjectService connecting to ElasticSearch...");
    try {
      const health: ClusterHealthResponse =
        await elasticSearchClient.cluster.health({});
      log.info(`ProjectService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error("Connection to Elasticsearch failed. Retrying...");
      log.log("error", "ProjectService checkConnection() method:", error);
    }
  }
}

async function checkIfIndexExist(indexName: string): Promise<boolean> {
  const result: boolean = await elasticSearchClient.indices.exists({
    index: indexName,
  });
  return result;
}

async function createIndex(indexName: string): Promise<void> {
  try {
    const result: boolean = await checkIfIndexExist(indexName);
    if (result) {
      log.info(`Index "${indexName}" already exist.`);
    } else {
      await elasticSearchClient.indices.create({ index: indexName });
      await elasticSearchClient.indices.refresh({ index: indexName });
      log.info(`Created index ${indexName}`);
    }
  } catch (error) {
    log.error(`An error occurred while creating the index ${indexName}`);
    log.log("error", "ProjectService createIndex() method error:", error);
  }
}

const getDocumentCount = async (index: string): Promise<number> => {
  try {
    const result: CountResponse = await elasticSearchClient.count({ index });
    return result.count;
  } catch (error) {
    log.log(
      "error",
      "ProjectService elasticsearch getDocumentCount() method error:",
      error
    );
    return 0;
  }
};

const getIndexedData = async (
  index: string,
  itemId: string
): Promise<ISellerProject> => {
  try {
    const result: GetResponse = await elasticSearchClient.get({
      index,
      id: itemId,
    });
    return result._source as ISellerProject;
  } catch (error) {
    log.log(
      "error",
      "ProjectService elasticsearch getIndexedData() method error:",
      error
    );
    return {} as ISellerProject;
  }
};

const addDataToIndex = async (
  index: string,
  itemId: string,
  projectDocument: unknown
): Promise<void> => {
  try {
    await elasticSearchClient.index({
      index,
      id: itemId,
      document: projectDocument,
    });
  } catch (error) {
    log.log(
      "error",
      "ProjectService elasticsearch addDataToIndex() method error:",
      error
    );
  }
};

const updateIndexedData = async (
  index: string,
  itemId: string,
  projectDocument: unknown
): Promise<void> => {
  try {
    await elasticSearchClient.update({
      index,
      id: itemId,
      doc: projectDocument,
    });
  } catch (error) {
    log.log(
      "error",
      "ProjectService elasticsearch updateIndexedData() method error:",
      error
    );
  }
};

const deleteIndexedData = async (
  index: string,
  itemId: string
): Promise<void> => {
  try {
    await elasticSearchClient.delete({
      index,
      id: itemId,
    });
  } catch (error) {
    log.log(
      "error",
      "ProjectService elasticsearch deleteIndexedData() method error:",
      error
    );
  }
};

export {
  elasticSearchClient,
  deleteIndexedData,
  updateIndexedData,
  getDocumentCount,
  getIndexedData,
  addDataToIndex,
  createIndex,
  startAndCheckElasticConnection,
};
