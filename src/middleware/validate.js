import { ZodError } from "zod";
import { ApiError } from "../utils/api.js";

export const validate = (schema) => (req, _res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.errors.map((e) => ({ field: e.path.join("."), message: e.message }));
      throw new ApiError("Datos de entrada inválidos", 400, errors);
    }
    next(err);
  }
};
