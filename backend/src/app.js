import "dotenv/config";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { initDB } from "./database/init.js";
import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import uploadsRoutes from "./routes/uploads.routes.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

const app = express();

// paths (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// se estiver atrás de proxy (Render, Nginx)
app.set("trust proxy", 1);

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // curl/postman
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS: origem não permitida"));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// body parsers (limite evita abuso)
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// logs
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// estáticos (server/uploads)
const uploadsPath = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

// init DB
await initDB();

// healthcheck
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "api-zenvra" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/uploads", uploadsRoutes);

// 404 e erro
app.use(notFound);
app.use(errorHandler);

export default app;