export const notFound = (req, _res, next) => { const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`); error.status = 404; next(error); };
export const errorHandler = (error, _req, res, _next) => {
  if (error.name === "ValidationError") return res.status(400).json({ success: false, message: "Datos invalidos", errors: Object.values(error.errors).map((item) => ({ field: item.path, message: item.message })) });
  if (error.code === 11000) return res.status(409).json({ success: false, message: "Ya existe un registro con esos datos", errors: [] });
  if (error.name === "CastError") return res.status(400).json({ success: false, message: "Identificador no valido", errors: [] });
  console.error(error);
  res.status(error.status || 500).json({ success: false, message: error.status ? error.message : "Error interno del servidor", errors: error.errors || [] });
};
