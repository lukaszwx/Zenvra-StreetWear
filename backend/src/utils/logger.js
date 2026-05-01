import fs from "fs";
import path from "path";

const logsFolder = path.resolve("logs");
const logFilePath = path.join(logsFolder, "error.log");

if (!fs.existsSync(logsFolder)) {
  fs.mkdirSync(logsFolder, { recursive: true });
}

export function logError(error, req) {
  const now = new Date().toISOString();
  const method = req?.method || "-";
  const route = req?.originalUrl || req?.url || "-";
  const status = error.status || 500;
  const message = error.message || "Erro não informado.";
  const stack = process.env.NODE_ENV === "production" ? "" : error.stack || "";

  const logEntry = [
    `Date: ${now}`,
    `Method: ${method}`,
    `Route: ${route}`,
    `Status: ${status}`,
    `Message: ${message}`,
    stack ? `Stack: ${stack}` : null,
    "--------------------------------------------------",
  ]
    .filter(Boolean)
    .join("\n") + "\n";

  fs.appendFileSync(logFilePath, logEntry, "utf8");
}
