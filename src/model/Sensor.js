import mongoose from "mongoose";

const sensorDataSchema = new mongoose.Schema({
  busVoltage: { type: Number, required: true },
  shuntVoltage: { type: Number, required: true },
  loadVoltage: { type: Number, required: true },
  current: { type: Number, required: true },
  power: { type: Number, required: true },
  // Menambahkan timestamp kapan data ini disimpan
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Sensor", sensorDataSchema);
