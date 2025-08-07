const { DataSource } = require("typeorm");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const { PinoLogger, logger } = require("../logger");

let dataSource = null;

const createDataSource = () => {
  if (!dataSource) {
    dataSource = new DataSource({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: process.env.NODE_ENV !== "production", // Only sync in development
      logging: process.env.NODE_ENV === "development",
      logger: process.env.NODE_ENV === "development" ? new PinoLogger() : undefined,
      entities: [path.join(__dirname, "../src/entities/**/*.js")],
      // Optimize for serverless
      extra: {
        max: 1, // Maximum number of connections in the pool
        min: 0, // Minimum number of connections in the pool
        acquireTimeoutMillis: 30000, // Maximum time to wait for a connection
        idleTimeoutMillis: 30000, // Maximum time a connection can be idle
      },
    });
  }
  return dataSource;
};

const getDataSource = async () => {
  const ds = createDataSource();
  
  if (!ds.isInitialized) {
    try {
      await ds.initialize();
      logger.info("Database connection has been established successfully");
    } catch (error) {
      logger.error("Error during Data Source initialization:", error);
      throw error;
    }
  }
  
  return ds;
};

module.exports = { dataSource: createDataSource(), getDataSource };
