const bearer = [{ bearerAuth: [] }];
const response = {
  200: { description: "Operacion correcta" },
  400: { description: "Datos invalidos" },
  401: { description: "No autenticado" },
  403: { description: "Sin permisos" },
  404: { description: "No encontrado" },
  409: { description: "Conflicto" },
};
const operation = (method, path, tag, summary, isPublic = false) => ({
  tags: [tag],
  summary,
  ...(!isPublic && { security: bearer }),
  ...(["post", "put", "patch"].includes(method) && {
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: { type: "object", additionalProperties: true },
        },
      },
    },
  }),
  parameters: [
    ...(path.match(/:[A-Za-z]+/g) || []).map((value) => ({
      name: value.slice(1),
      in: "path",
      required: true,
      schema: { type: "string" },
    })),
  ],
  responses: {
    ...response,
    ...(method === "post" && { 201: { description: "Registro creado" } }),
  },
});
const routes = [
  ["post", "/api/auth/register", "Auth", "Registrar cliente", true],
  ["post", "/api/auth/login", "Auth", "Iniciar sesion", true],
  ["get", "/api/auth/me", "Auth", "Perfil autenticado"],
  ["patch", "/api/auth/change-password", "Auth", "Cambiar contrasena"],
  ["get", "/api/users/me", "Users", "Consultar perfil"],
  ["patch", "/api/users/me", "Users", "Actualizar perfil"],
  ["get", "/api/users", "Users", "Listar usuarios"],
  ["post", "/api/users", "Users", "Crear usuario"],
  ["get", "/api/users/:id", "Users", "Detalle de usuario"],
  ["put", "/api/users/:id", "Users", "Actualizar usuario"],
  ["patch", "/api/users/:id/status", "Users", "Cambiar estado"],
  ["patch", "/api/users/:id/role", "Users", "Cambiar rol"],
  ["delete", "/api/users/:id", "Users", "Desactivar usuario"],
  ["get", "/api/services", "Services", "Listar servicios", true],
  ["get", "/api/services/:id", "Services", "Detalle de servicio", true],
  ["post", "/api/services", "Services", "Crear servicio"],
  ["put", "/api/services/:id", "Services", "Actualizar servicio"],
  ["patch", "/api/services/:id/status", "Services", "Cambiar estado"],
  ["delete", "/api/services/:id", "Services", "Desactivar servicio"],
  ["get", "/api/barbers", "Barbers", "Listar barberos", true],
  ["get", "/api/barbers/:id", "Barbers", "Detalle de barbero", true],
  [
    "get",
    "/api/barbers/:id/services",
    "Barbers",
    "Servicios del barbero",
    true,
  ],
  [
    "get",
    "/api/barbers/:id/availability",
    "Availability",
    "Disponibilidad del barbero",
    true,
  ],
  [
    "get",
    "/api/barbers/:barberId/schedules",
    "Schedules",
    "Horarios del barbero",
    true,
  ],
  ["post", "/api/barbers", "Barbers", "Crear perfil de barbero"],
  ["put", "/api/barbers/:id", "Barbers", "Actualizar perfil"],
  ["patch", "/api/barbers/:id/status", "Barbers", "Cambiar disponibilidad"],
  ["patch", "/api/barbers/:id/services", "Barbers", "Asignar servicios"],
  ["delete", "/api/barbers/:id", "Barbers", "Desactivar barbero"],
  ["get", "/api/schedules", "Schedules", "Listar horarios"],
  ["get", "/api/schedules/:id", "Schedules", "Detalle de horario"],
  ["post", "/api/schedules", "Schedules", "Crear horario"],
  ["put", "/api/schedules/:id", "Schedules", "Actualizar horario"],
  ["patch", "/api/schedules/:id/status", "Schedules", "Cambiar dia laborable"],
  ["delete", "/api/schedules/:id", "Schedules", "Eliminar horario"],
  [
    "put",
    "/api/barbers/:barberId/schedules/:dayOfWeek",
    "Schedules",
    "Guardar horario semanal",
  ],
  [
    "get",
    "/api/availability",
    "Availability",
    "Consultar horas disponibles",
    true,
  ],
  ["post", "/api/appointments", "Appointments", "Crear cita"],
  ["get", "/api/appointments/my-appointments", "Appointments", "Mis citas"],
  ["get", "/api/appointments/:id", "Appointments", "Detalle de cita"],
  ["patch", "/api/appointments/:id/cancel", "Appointments", "Cancelar cita"],
  ["get", "/api/barber/appointments", "Barber Agenda", "Consultar agenda"],
  [
    "patch",
    "/api/barber/appointments/:id/approve",
    "Barber Agenda",
    "Aprobar cita",
  ],
  [
    "patch",
    "/api/barber/appointments/:id/reject",
    "Barber Agenda",
    "Rechazar cita",
  ],
  [
    "patch",
    "/api/barber/appointments/:id/complete",
    "Barber Agenda",
    "Completar cita",
  ],
  [
    "patch",
    "/api/barber/appointments/:id/no-show",
    "Barber Agenda",
    "Marcar ausencia",
  ],
  [
    "get",
    "/api/admin/appointments",
    "Admin Appointments",
    "Listar todas las citas",
  ],
  [
    "get",
    "/api/admin/appointments/:id",
    "Admin Appointments",
    "Detalle administrativo",
  ],
  [
    "patch",
    "/api/admin/appointments/:id/reassign",
    "Admin Appointments",
    "Reasignar cita",
  ],
  [
    "patch",
    "/api/admin/appointments/:id/status",
    "Admin Appointments",
    "Cambiar estado",
  ],
  [
    "patch",
    "/api/admin/appointments/:id/cancel",
    "Admin Appointments",
    "Cancelar cita",
  ],
  ["get", "/api/audit-logs", "Audit Logs", "Listar auditorias"],
  ["get", "/api/audit-logs/:id", "Audit Logs", "Detalle de auditoria"],
  [
    "get",
    "/api/audit-logs/user/:userId",
    "Audit Logs",
    "Auditorias por usuario",
  ],
  ["get", "/api/dashboard/summary", "Dashboard", "Resumen del sistema"],
  ["get", "/api/reports/appointments-by-status", "Reports", "Citas por estado"],
  ["get", "/api/reports/popular-services", "Reports", "Servicios populares"],
  [
    "get",
    "/api/reports/appointments-by-barber",
    "Reports",
    "Citas por barbero",
  ],
  ["get", "/api/reports/appointments-by-date", "Reports", "Citas por fecha"],
  ["get", "/api/reports/estimated-revenue", "Reports", "Ingreso estimado"],
];
const paths = {
  "/api/health": {
    get: operation("get", "/api/health", "Health", "Estado de la API", true),
  },
};
routes.forEach(([method, rawPath, tag, summary, isPublic]) => {
  const path = rawPath.replace(/:([A-Za-z]+)/g, "{$1}");
  paths[path] ||= {};
  paths[path][method] = operation(method, rawPath, tag, summary, isPublic);
});
export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "BarberShop Appointments API",
    version: "1.0.0",
    description:
      "API REST para usuarios, barberos, servicios, horarios, citas, auditorias y reportes.",
  },
  servers: [{ url: "/", description: "Servidor actual" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          role: { type: "string", enum: ["CLIENT", "BARBER", "ADMIN"] },
          status: { type: "string", enum: ["ACTIVE", "INACTIVE", "SUSPENDED"] },
        },
      },
      Service: {
        type: "object",
        properties: {
          name: { type: "string" },
          durationMinutes: { type: "integer" },
          price: { type: "number" },
          status: { type: "string" },
        },
      },
      Appointment: {
        type: "object",
        properties: {
          clientId: { type: "string" },
          barberId: { type: "string" },
          serviceId: { type: "string" },
          appointmentDate: { type: "string", format: "date" },
          startTime: { type: "string", example: "09:00" },
          endTime: { type: "string", example: "09:30" },
          status: {
            type: "string",
            enum: [
              "PENDING",
              "APPROVED",
              "REJECTED",
              "CANCELLED",
              "COMPLETED",
              "NO_SHOW",
            ],
          },
        },
      },
    },
  },
  paths,
};
