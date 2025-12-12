import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  user_name: String,
  mode: String,
  start_time: Date,
  end_time: Date,
  duration_ms: Number,
  duration_str: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Session", SessionSchema);
