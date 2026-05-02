import "dotenv/config";
import app from "./app.js";

// Verificar JWT_SECRET para produção
const jwtSecret = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === 'production';

if (!jwtSecret) {
  console.error("⚠️  JWT_SECRET não definido no .env");
  console.log("📝 Adicione JWT_SECRET=sua-chave-super-secreta no .env");
  process.exit(1);
}

if (isProduction && jwtSecret.length < 32) {
  console.error("⚠️  JWT_SECRET muito fraca para produção!");
  console.log("🔒 Use uma chave com pelo menos 32 caracteres para produção");
  console.log("💡 Exemplo: openssl rand -base64 32");
  process.exit(1);
}

const DEFAULT_PORT = Number(process.env.PORT) || 3000;
const FALLBACK_PORTS = [8000, 8001, 8002, 8003, 8004];

function startServer(port = DEFAULT_PORT, attempt = 0) {
  const server = app.listen(port, () => {
    console.log("\n Server iniciado!");
    console.log(` http://localhost:${port}`);
    console.log(` ENV: ${process.env.NODE_ENV || "development"}`);
    console.log("====================================\n");
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.warn(` Porta ${port} em uso`);

      if (attempt < FALLBACK_PORTS.length) {
        const nextPort = FALLBACK_PORTS[attempt];
        console.log(` Tentando ${nextPort}...\n`);
        startServer(nextPort, attempt + 1);
      } else {
        console.error(" Sem portas disponíveis");
        process.exit(1);
      }
    } else {
      console.error(" Erro ao iniciar:", error);
      process.exit(1);
    }
  });

  //  Graceful shutdown (evita corrupção e conexões abertas)
  function shutdown(signal) {
    console.log(`\n Recebido ${signal}. Encerrando servidor...`);

    server.close(() => {
      console.log(" Servidor encerrado com segurança");
      process.exit(0);
    });

    // fallback se travar
    setTimeout(() => {
      console.error(" Forçando encerramento");
      process.exit(1);
    }, 5000);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startServer();