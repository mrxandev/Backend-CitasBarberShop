import { ApiError } from "./api.js";

export const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
export const timeToMinutes = (time) => {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time || "")) throw new ApiError("La hora debe usar el formato HH:mm");
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};
export const minutesToTime = (minutes) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
export const addMinutes = (time, duration) => minutesToTime(timeToMinutes(time) + duration);
export const overlaps = (startA, endA, startB, endB) => timeToMinutes(startA) < timeToMinutes(endB) && timeToMinutes(endA) > timeToMinutes(startB);
export const dateOnly = (value) => {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) throw new ApiError("La fecha no es valida");
  return date;
};
export const localDateString = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
