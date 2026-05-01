# Zenvra - Loja de Tênis Premium

![Zenvra Logo](public/images/logo.png)

Uma loja online moderna e responsiva especializada em tênis premium, desenvolvida com tecnologias de ponta para oferecer uma experiência de compra excepcional.

## Características

- **Interface Moderna**: Design responsivo com Tailwind CSS e animações suaves
- **Catálogo Completo**: Produtos organizados por categorias (Sneakers, Roupas, Acessórios)
- **Painel Administrativo**: Gerenciamento completo de produtos com autenticação
- **Upload de Imagens**: Sistema seguro de upload com validações
- **API RESTful**: Backend robusto com Express.js e SQLite
- **Autenticação JWT**: Sistema de login seguro para administradores
- **Logs de Erro**: Monitoramento e logging de erros para manutenção

## Tecnologias Utilizadas

### Frontend
- **React 18.3.1** - Framework JavaScript
- **Vite 5.4.19** - Build tool e dev server
- **React Router 7.14.2** - Roteamento
- **Tailwind CSS 4.1.8** - Framework CSS
- **Framer Motion 12.10.0** - Animações
- **Lucide React 0.511.0** - Ícones

### Backend
- **Node.js** - Runtime JavaScript
- **Express 4.19.2** - Framework web
- **SQLite 5.1.1** - Banco de dados
- **Multer 2.1.1** - Upload de arquivos
- **JWT** - Autenticação
- **Morgan 1.10.0** - Logging HTTP
- **CORS 2.8.5** - Controle de origem cruzada

## Instalação

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Passos de Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/zenvra.git
   cd zenvra
   ```

2. **Instale as dependências do frontend**
   ```bash
   npm install
   ```

3. **Instale as dependências do backend**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Configure as variáveis de ambiente**

   Crie um arquivo `.env` na raiz do projeto:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

   Crie um arquivo `backend/.env`:
   ```env
   PORT=3000
   ADMIN_EMAIL=admin@zenvra.com
   ADMIN_PASSWORD=admin123
   ADMIN_TOKEN=seu-token-jwt-seguro-aqui
   FRONTEND_URL=http://localhost:5173
   ```

5. **Inicie o banco de dados**
   ```bash
   cd backend
   npm run dev
   ```
   O banco SQLite será criado automaticamente com dados iniciais.

## Uso

### Desenvolvimento

1. **Inicie o backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Inicie o frontend** (em outro terminal)
   ```bash
   npm run dev
   ```

3. **Acesse a aplicação**
   - Loja: http://localhost:5173
   - Admin: http://localhost:5173/painel-interno-zenvra

### Login Administrativo
- **Email**: admin@zenvra.com
- **Senha**: admin123

### Build para Produção

```bash
# Frontend
npm run build

# Backend
cd backend
npm run start
```

## API Endpoints

### Produtos
- `GET /api/products` - Listar todos os produtos
- `GET /api/products/:id` - Obter produto por ID
- `POST /api/products` - Criar produto (autenticado)
- `PUT /api/products/:id` - Atualizar produto (autenticado)
- `DELETE /api/products/:id` - Deletar produto (autenticado)

### Uploads
- `POST /api/uploads` - Upload de imagem (autenticado)

### Autenticação
- `POST /api/auth/login` - Login administrativo
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/forgot-password` - Solicitar redefinição de senha
- `POST /api/auth/reset-password` - Redefinir senha com token
- `POST /api/auth/create-admin` - Criar novo administrador (autenticado como admin)

## Estrutura do Projeto

```
zenvra/
├── public/                 # Arquivos estáticos
├── src/                    # Código fonte frontend
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas da aplicação
│   ├── services/          # Serviços API
│   └── styles/            # Estilos CSS
├── backend/                 # Backend
│   ├── src/
│   │   ├── controllers/   # Controladores API
│   │   ├── database/      # Configuração BD
│   │   ├── middlewares/   # Middlewares
│   │   ├── routes/        # Rotas API
│   │   └── utils/         # Utilitários
│   └── logs/              # Logs de erro
├── package.json           # Dependências frontend
└── README.md             # Este arquivo
```

## Segurança

- Autenticação JWT para rotas administrativas
- Validação de entrada de dados
- Limitação de tamanho de upload (5MB)
- Filtros de tipo de arquivo para imagens
- CORS configurado para origem específica
- Logs de erro para monitoramento

## Responsividade

A aplicação é totalmente responsiva e otimizada para:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (até 767px)

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Contato

- **Email**: contato@zenvra.com
- **Website**: https://zenvra.com
- **Instagram**: @zenvra_oficial

---

Feito pela equipe Zenvra
