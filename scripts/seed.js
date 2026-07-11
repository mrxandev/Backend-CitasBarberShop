import bcrypt from "bcryptjs";
import { connectDB } from "../src/db/connection.js";
import BarberProfile from "../src/models/BarberProfile.js";
import Schedule from "../src/models/Schedule.js";
import Service from "../src/models/Service.js";
import User from "../src/models/User.js";

const adminPassword = process.env.SEED_ADMIN_PASSWORD;
const barberPassword = process.env.SEED_BARBER_PASSWORD;
if (!adminPassword || !barberPassword) {
  throw new Error("SEED_ADMIN_PASSWORD y SEED_BARBER_PASSWORD son obligatorias para ejecutar el seed");
}

await connectDB();
const password = await bcrypt.hash(adminPassword, 10);
await User.findOneAndUpdate({ email: "admin@barberia.com" }, { firstName: "Administrador", lastName: "Principal", phone: "0000000000", password, role: "ADMIN", status: "ACTIVE" }, { upsert: true, new: true });
const services = await Promise.all([["Corte clasico",30,15],["Corte moderno",45,20],["Recorte de barba",30,12],["Corte y barba",60,28]].map(([name,durationMinutes,price]) => Service.findOneAndUpdate({ name }, { name, durationMinutes, price, description: name, status: "ACTIVE" }, { upsert: true, new: true })));
for (const [firstName,lastName,email,specialty] of [["Carlos","Perez","carlos@barberia.com","Cortes modernos"],["Miguel","Rodriguez","miguel@barberia.com","Cortes clasicos y barba"]]) {
  const user = await User.findOneAndUpdate({ email }, { firstName, lastName, email, phone: "0000000000", password: await bcrypt.hash(barberPassword, 10), role: "BARBER", status: "ACTIVE" }, { upsert: true, new: true });
  const barber = await BarberProfile.findOneAndUpdate({ userId: user._id }, { userId: user._id, specialty, yearsOfExperience: 5, serviceIds: services.map((service) => service._id), isAvailable: true }, { upsert: true, new: true });
  for (const dayOfWeek of ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"]) await Schedule.findOneAndUpdate({ barberId: barber._id, dayOfWeek }, { barberId: barber._id, dayOfWeek, startTime: "09:00", endTime: "18:00", breakStartTime: "12:00", breakEndTime: "13:00", isWorkingDay: true }, { upsert: true });
}
console.log("Datos iniciales creados correctamente");
process.exit(0);
