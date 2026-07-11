# Backend Citas BarberShop

API REST en Node.js, Express y MongoDB para gestionar clientes, barberos, servicios, horarios, citas, auditorias y reportes.

## Ejecucion

```bash
npm install
npm run seed
npm run dev
```

- API: `http://localhost:3000`
- Health: `http://localhost:3000/api/health`
- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/api-docs.json`

## Variables

Copiar `.env.example` como `.env` y configurar `MONGODB_URI`, `JWT_SECRET`, `PORT` y `JWT_EXPIRES_IN`. `.env` esta excluido de Git. `DNS_SERVERS` permite indicar resolvedores DNS para conexiones `mongodb+srv` cuando Node no puede usar correctamente el DNS de Windows.

## Usuarios iniciales

Configurar `SEED_ADMIN_PASSWORD` y `SEED_BARBER_PASSWORD` en `.env`. Ejecutar `npm run seed` para crear el administrador, dos barberos, cuatro servicios y horarios de lunes a sabado. Las credenciales no se incluyen en el repositorio.

## Seguridad y reglas

- JWT Bearer y roles `CLIENT`, `BARBER`, `ADMIN`.
- Contrasenas protegidas con bcrypt y nunca incluidas en respuestas.
- CORS abierto (`origin: *`) según el requisito del proyecto.
- Citas limitadas a 30 dias, dentro de la jornada y fuera del descanso.
- Bloqueo de intervalos solapados para citas `PENDING` y `APPROVED`.
- Eliminacion logica de usuarios, servicios y barberos.
