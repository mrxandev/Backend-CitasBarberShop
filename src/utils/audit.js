import AuditLog from "../models/AuditLog.js";

export const audit = async ({ req, action, entity, entityId, description, previousData, newData }) => {
  await AuditLog.create({
    userId: req?.user?._id || null,
    action,
    entity,
    entityId,
    description,
    previousData,
    newData,
    ipAddress: req?.ip,
  });
};
