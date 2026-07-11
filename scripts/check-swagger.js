import { swaggerSpec } from "../src/config/swagger.js";
const count = Object.values(swaggerSpec.paths).reduce((total, path) => total + Object.keys(path).length, 0);
if (count < 50) throw new Error(`Swagger incompleto: ${count} operaciones`);
console.log(`Swagger valido: ${count} operaciones documentadas`);
