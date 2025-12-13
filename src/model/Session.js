import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  user_name: String,
  mode: String,
  start_time: Date,
  end_time: Date,
  duration_ms: Number,
  duration_str: String,
  avg_power: { type: Number, default: 0 },
  max_power: { type: Number, default: 0 },
  total_readings: { type: Number, default: 0 },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Session", SessionSchema);
