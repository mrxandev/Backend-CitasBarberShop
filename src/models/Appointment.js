import mongoose from "mongoose";
const schema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  barberId: { type: mongoose.Schema.Types.ObjectId, ref: "BarberProfile", required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  appointmentDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "COMPLETED", "NO_SHOW"], default: "PENDING" },
  clientNotes: { type: String, default: "" },
  barberResponse: { type: String, default: null },
  cancellationReason: { type: String, default: null },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  approvedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
}, { timestamps: true });
schema.index({ barberId: 1, appointmentDate: 1, status: 1 });
export default mongoose.model("Appointment", schema);
