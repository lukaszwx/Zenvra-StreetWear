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

const DEFAULT_PORT = 3000;

function startServer(port = DEFAULT_PORT) {
  const server = app.listen(port, () => {
    console.log("\n Server iniciado!");
    console.log(` http://localhost:${port}`);
    console.log(` ENV: ${process.env.NODE_ENV || "development"}`);
    console.log("====================================\n");
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(` Porta ${port} já está em uso. Use uma porta diferente ou pare o processo que está usando a porta 3000.`);
      process.exit(1);
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