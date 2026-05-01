import "dotenv/config";
import app from "./app.js";

const DEFAULT_PORT = Number(process.env.PORT) || 3000;
const FALLBACK_PORTS = [3001, 3002, 3003, 3004, 3005];

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