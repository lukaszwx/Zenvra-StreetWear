import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

// Se .env não existe, criar a partir do .env.example
if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    let content = fs.readFileSync(envExamplePath, 'utf8');
    
    // Substituir valores padrão para desenvolvimento
    content = content.replace('sua-chave-super-secreta-aqui-mude-para-producao', 'chave-secreta-desenvolvimento-12345678901234567890');
    content = content.replace('seu-email@gmail.com', 'admin@zenvra.com');
    content = content.replace('sua-senha-ou-app-password', 'admin123');
    
    fs.writeFileSync(envPath, content);
    console.log('✅ Arquivo .env criado com sucesso!');
    console.log('📝 Configurações básicas aplicadas para desenvolvimento');
  } else {
    // Criar .env básico se .env.example não existir
    const basicEnv = `NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=chave-secreta-desenvolvimento-12345678901234567890
JWT_EXPIRES_IN=8h
ADMIN_EMAIL=admin@zenvra.com
ADMIN_PASSWORD=admin123`;
    
    fs.writeFileSync(envPath, basicEnv);
    console.log('✅ Arquivo .env criado com configurações básicas!');
  }
} else {
  console.log('✅ Arquivo .env já existe');
}

console.log('🚀 Agora você pode iniciar o servidor com: node src/server.js');
