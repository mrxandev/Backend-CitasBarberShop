import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  action: { type: String, required: true },
  entity: { type: String, required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
  description: { type: String, required: true },
  previousData: { type: mongoose.Schema.Types.Mixed, default: null },
  newData: { type: mongoose.Schema.Types.Mixed, default: null },
  ipAddress: { type: String, default: null },
}, { timestamps: { createdAt: true, updatedAt: false } });
export default mongoose.model("AuditLog", schema);
