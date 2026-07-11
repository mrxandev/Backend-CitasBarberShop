import mongoose from "mongoose";
const schema = new mongoose.Schema({
  barberId: { type: mongoose.Schema.Types.ObjectId, ref: "BarberProfile", required: true },
  dayOfWeek: { type: String, enum: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  breakStartTime: { type: String, default: null },
  breakEndTime: { type: String, default: null },
  isWorkingDay: { type: Boolean, default: true },
}, { timestamps: true });
schema.index({ barberId: 1, dayOfWeek: 1 }, { unique: true });
export default mongoose.model("Schedule", schema);
