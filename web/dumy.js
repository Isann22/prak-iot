import express from "express";
import mqtt from "mqtt";
import cors from "cors";

const app = express();
// Middleware
app.use(cors());

// --- 1. KONFIGURASI MQTT ---
const mqttOptions = {
  host: "143ddc416d9a4f998c0284a2193eccdf.s1.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "Device11",
  password: "Device11",
  rejectUnauthorized: false,
};

const TOPIC_PUBLISH = "angklung/power"; // Topik untuk publish data

// Variabel Global Data Sensor
let latestSensorData = {
  busVoltage: 0,
  shuntVoltage: 0,
  loadVoltage: 0,
  current: 0,
  power: 0,
  timestamp: null,
};

// Inisialisasi MQTT Client
const client = mqtt.connect(mqttOptions);

client.on("connect", () => {
  console.log("✅ Terhubung ke HiveMQ Cloud");

  // Memulai simulasi pengiriman data sensor setiap 5 detik
  setInterval(() => {
    simulateAndPublishData();
  }, 5000);
});

client.on("error", (err) => {
  console.error("❌ MQTT Error:", err);
});

// Fungsi untuk mensimulasikan data sensor dan kirim ke MQTT
function simulateAndPublishData() {
  // Update data dengan nilai dummy/random (Ganti ini dengan pembacaan sensor asli Anda)
  latestSensorData = {
    busVoltage: (Math.random() * 5 + 10).toFixed(2), // 10V - 15V
    shuntVoltage: (Math.random() * 0.5).toFixed(3),
    loadVoltage: (Math.random() * 5 + 10).toFixed(2),
    current: (Math.random() * 2).toFixed(2), // 0A - 2A
    power: (Math.random() * 20).toFixed(2), // 0W - 20W
    timestamp: new Date().toISOString(),
  };

  // Kirim ke MQTT Broker
  const payload = JSON.stringify(latestSensorData);
  client.publish(TOPIC_PUBLISH, payload);
  console.log(`📤 Data Sent to MQTT [${TOPIC_PUBLISH}]:`, payload);
}

// Jalankan Server Express
const PORT = 5100;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
