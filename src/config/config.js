import "dotenv/config";

export const config = {
  MONGO_URL: process.env.MONGO_URL,
  HIVEMQ_URL: process.env.HIVEMQ_URL,
  HIVEMQ_PORT: process.env.HIVEMQ_PORT || 8883,
  HIVEMQ_USERNAME: process.env.HIVEMQ_USERNAME,
  HIVEMQ_PASSWORD: process.env.HIVEMQ_PASSWORD,
};
