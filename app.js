import express from "express";
import connectDb from "./src/config/db.js";
import mqtt from "./src/config/mqtt.js";
import cors from "cors";
import router from "./src/routes/router.js";
import { config } from "./src/config/config.js";
import listener from "./src/jobs/jobs.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db_url = config.MONGO_URL;

const mqttOptions = {
  host: config.HIVEMQ_URL,
  port: config.HIVEMQ_PORT,
  protocol: "mqtts",
  username: config.HIVEMQ_USERNAME,
  password: config.HIVEMQ_PASSWORD,
  rejectUnauthorized: false,
};

async function init() {
  // koneksi ke db
  connectDb(db_url);

  // setup mqtt
  mqtt.setupMQTT(mqttOptions);

  // setup save db tiap 5 menit
  listener();

  app.use(router);

  app.listen(PORT, () => {
    console.log(`server running di http://localhost:${PORT}`);
  });
}

init();
