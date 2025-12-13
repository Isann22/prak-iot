import mqtt from "../config/mqtt.js";
import mongoose from "mongoose";
import Session from "../model/Session.js";

const saveSession = async (req, res) => {
  try {
    const {
      user_name,
      mode,
      start_time,
      end_time,
      duration_ms,
      duration_str,
      avg_power,
      max_power,
      total_readings,
    } = req.body;

    const newSession = new Session({
      user_name,
      mode,
      start_time,
      end_time,
      duration_ms,
      duration_str,
      avg_power,
      max_power,
      total_readings,
    });

    await newSession.save();
    res
      .status(201)
      .json({ message: "Sesi berhasil disimpan", data: newSession });
  } catch (error) {
    console.error("Error saving session:", error);
    res
      .status(500)
      .json({ message: "Gagal menyimpan sesi", error: error.message });
  }
};

const getSessionsData = async (req, res) => {
  try {
    const collection = mongoose.connection.db.collection("sessions");

    const query = {};
    if (req.query.mode) {
      query.mode = req.query.mode;
    }

    const sessions = await collection
      .find(query)
      .sort({ duration_ms: -1 })
      .toArray();

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil data sesi", error: error.message });
  }
};

const streamData = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  console.log("Client connected to stream");

  const sendSensorData = () => {
    const data = mqtt.getLatestSensorData();

    const eventData = JSON.stringify({ data: data });
    res.write(`data: ${eventData}\n\n`);
  };

  const intervalId = setInterval(sendSensorData, 5000);

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
};

export default { getSessionsData, streamData, saveSession };
