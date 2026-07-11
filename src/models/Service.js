import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: "" },
  durationMinutes: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
}, { timestamps: true });
export default mongoose.model("Service", schema);
