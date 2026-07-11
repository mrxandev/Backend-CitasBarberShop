export const ok = (res, message, data = {}, status = 200) => res.status(status).json({ success: true, message, data });
export const fail = (res, message, status = 400, errors = []) => res.status(status).json({ success: false, message, errors });
export const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

export class ApiError extends Error {
  constructor(message, status = 400, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export const pagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

export const paginated = (res, data, totalItems, page, limit) => res.json({
  success: true,
  data,
  pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
});
