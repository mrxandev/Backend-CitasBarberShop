import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  specialty: { type: String, required: true, trim: true },
  biography: { type: String, default: "" },
  yearsOfExperience: { type: Number, min: 0, default: 0 },
  serviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.model("BarberProfile", schema);
