import mqtt from "mqtt";

let latestSensorData = {
  busVoltage: null,
  shuntVoltage: null,
  loadVoltage: null,
  current: null,
  power: null,
  timestamp: null,
};

let mqttClient = null;

const setupMQTT = (mqttOptions) => {
  const client = mqtt.connect(mqttOptions);

  client.on("connect", () => {
    console.log("Connected to MQTT broker");

    mqttClient = client;

    client.subscribe("angklung/power", (err) => {
      if (!err) {
        console.log("Subscribed to topic: angklung/power");
      }
    });
  });

  client.on("message", (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("Received power data:", data);

      latestSensorData = {
        busVoltage: data.busVoltage,
        shuntVoltage: data.shuntVoltage,
        loadVoltage: data.loadVoltage,
        current: data.current,
        power: data.power,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Error parsing MQTT message:", error);
    }
  });

  client.on("error", (error) => {
    console.error("MQTT error:", error);
  });

  return client;
};

const publish = (topic, message) => {
  if (mqttClient && mqttClient.connected) {
    mqttClient.publish(topic, message, (err) => {
      if (err) {
        console.error(`Gagal mempublikasikan ke topik ${topic}:`, err);
      } else {
        console.log(`Pesan terkirim ke topik ${topic}: ${message}`);
      }
    });
  } else {
    console.error(
      "MQTT client tidak terhubung. Tidak dapat mempublikasikan pesan."
    );
    throw new Error("MQTT client not connected.");
  }
};

const getLatestSensorData = () => {
  return latestSensorData;
};

export default { setupMQTT, getLatestSensorData };
