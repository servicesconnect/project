import dotenv from "dotenv";

dotenv.config();

class EnvConfig {
  public port: string | undefined;
  public app_name: string | undefined;
  public node_env: string | undefined;
  public elastic_search_url: string | undefined;
  public elastic_apm_server_url: string | undefined;
  public elastic_apm_secret_token: string | undefined;
  public enable_apm: string | undefined;
  public jwt_token: string | undefined;
  public gateway_jwt_token: string | undefined;
  public api_gateway_url: string | undefined;
  public rabbitmq_endpoint: string | undefined;
  public cloud_name: string | undefined;
  public cloud_api_key: string | undefined;
  public cloud_api_secret: string | undefined;
  public redis_host: string | undefined;
  public database_url: string | undefined;

  constructor() {
    this.port = process.env.PORT || "";
    this.app_name = process.env.APP_NAME || "";
    this.node_env = process.env.NODE_ENV || "";
    this.elastic_search_url = process.env.ELASTIC_SEARCH_URL || "";
    this.elastic_apm_server_url = process.env.ELASTIC_APM_SERVER_URL || "";
    this.elastic_apm_secret_token = process.env.ELASTIC_APM_SECRET_TOKEN || "";
    this.enable_apm = process.env.ENABLE_APM || "";
    this.gateway_jwt_token = process.env.GATEWAY_JWT_TOKEN || "";
    this.jwt_token = process.env.JWT_TOKEN || "";
    this.api_gateway_url = process.env.API_GATEWAY_URL || "";
    this.rabbitmq_endpoint = process.env.RABBITMQ_ENDPOINT || "";
    this.cloud_name = process.env.CLOUD_NAME || "";
    this.cloud_api_key = process.env.CLOUD_API_KEY || "";
    this.database_url = process.env.DATABASE_URL || "";
    this.redis_host = process.env.REDIS_HOST || "";
    this.cloud_api_secret = process.env.CLOUD_API_SECRET || "";
  }
}

export const envConfig: EnvConfig = new EnvConfig();
