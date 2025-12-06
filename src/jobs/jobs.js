import mqtt from "../config/mqtt.js";
import Sensor from "../model/Sensor.js";

async function saveToDatabase(data) {
  if (!data || Object.keys(data).length === 0) {
    console.log("No valid data to save.");
    return;
  }

  try {
    const result = await Sensor.insertOne(data);

    console.log(`sukses save data sensor. ID: ${result._id}`);
  } catch (error) {
    console.error("Error :", error.message);
  }
}

function listener() {
  // save data dari mqtt tiap 5 menit
  const intervalTime = 1 * 60 * 1000;
  setInterval(() => {
    const latestData = mqtt.getLatestSensorData();
    saveToDatabase(latestData);
  }, intervalTime);
}

export default listener;
