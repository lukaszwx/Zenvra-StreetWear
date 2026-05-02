# Zenvra - Loja Streetwear Enterprise

![Zenvra Logo](public/images/logo.png)

🚀 **Plataforma e-commerce enterprise-level moderna e responsiva** especializada em streetwear, desenvolvida com tecnologias de ponta para oferecer uma experiência de compra cinematográfica Apple-level.

## ✨ Funcionalidades Principais

### 🛍️ **E-commerce Completo**
- **Catálogo Dinâmico**: Produtos organizados por categorias (Sneakers, Roupas, Acessórios)
- **Carrinho Funcional**: Sistema completo com cálculo de frete e impostos
- **Wishlist Inteligente**: Lista de desejos com persistência local
- **Checkout Profissional**: Múltiplas opções de pagamento e validação
- **Rastreamento de Pedidos**: Sistema completo tracking em tempo real

### 🎯 **Sistema de Promoções Enterprise**
- **Gestão de Promoções**: Descontos, frete grátis, leve 2 pague 1
- **Sistema de Cupons**: Validação avançada com limites e condições
- **Banner Dinâmico**: Auto-rotate de promoções no frontend
- **Storage Compartilhado**: Sincronização em tempo real admin ↔ frontend
- **Validações Inteligentes**: Datas, limites, condições automáticas

### 🎨 **UI/UX Cinematográfica**
- **Design Apple-level**: Interface moderna com Tailwind CSS
- **Animações GSAP**: Transições suaves e micro-interações
- **Responsividade Perfeita**: Desktop, Tablet, Mobile
- **Dark Theme Elegante**: Paleta esmeralda com gradientes
- **Componentes Premium**: Botões, cards, modais refinados

### 🛡️ **Painel Administrativo Robusto**
- **Dashboard Analytics**: Métricas em tempo real com gráficos
- **Gestão de Produtos**: CRUD completo com upload de imagens
- **Controle de Promoções**: Sistema completo de marketing
- **Gestão de Cupons**: Criação e validação de cupons
- **Controle de Admins**: Sistema de usuários e permissões
- **Logs e Monitoramento**: Sistema completo de auditoria

### 🔧 **Tecnologia Avançada**
- **React 18.3.1**: Framework moderno com hooks
- **Vite 5.4.19**: Build tool ultra-rápido
- **GSAP 3.15.0**: Animações profissionais
- **Lucide React**: Ícones consistentes
- **Express.js**: API RESTful robusta
- **SQLite**: Banco de dados leve e eficiente

### 🚀 **Recursos Enterprise**
- **PWA Support**: Install prompt e service worker
- **Toast System**: Notificações elegantes
- **Search Avançado**: Busca com filtros e sugestões
- **Support Center**: Central de ajuda completa
- **Order Tracking**: Rastreamento em tempo real
- **AI Recommendations**: Sistema inteligente de sugestões

## Paleta de Cores

O design do site utiliza uma paleta dark com toques de verde esmeralda:

- **Fundo Principal**: Gradiente escuro (#0f1a21 → #050709 → #030405)
- **Texto Principal**: Cinza claro (#f3f4f6)
- **Verde Esmeralda**: #10b981 (emerald-400) e #34d399 (emerald-300)
- **Acentos**: Branco (#ffffff) e cinzas variados (zinc-300, zinc-400)
- **Elementos Interativos**: Verde com glow para botões e destaques

## 🛠️ Stack Tecnológico Enterprise

### Frontend (React 18.3.1)
- **Vite 5.4.19** - Build tool ultra-rápido ⚡
- **React Router 7.14.2** - Roteamento SPA
- **Tailwind CSS 4.1.8** - Framework CSS utility-first
- **GSAP 3.15.0** - Animações profissionais 🎬
- **Lucide React 0.511.0** - Ícones consistentes
- **Framer Motion 12.10.0** - Animações declarativas

### Backend (Node.js)
- **Express 4.19.2** - Framework web robusto
- **SQLite 5.1.1** - Banco de dados leve
- **JWT** - Autenticação stateless
- **Multer 2.1.1** - Upload de arquivos seguro
- **Morgan 1.10.0** - Logging HTTP
- **CORS 2.8.5** - Controle de origem
- **Rate Limiting** - Proteção contra DDoS

### 🚀 Performance & Otimização
- **Code Splitting** - Loading otimizado
- **Lazy Loading** - Componentes sob demanda
- **Service Worker** - PWA functionality
- **Image Optimization** - WebP support
- **Bundle Analysis** - Tamanho otimizado

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
   O banco SQLite será criado automaticamente com dados iniciais.

## Uso

### Desenvolvimento

1. **Inicie o backend**
   ```bash
    cd backend

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

### Recuperação de Senha
Para redefinir a senha de um administrador:
1. Use `POST /api/auth/forgot-password` com o email
2. O sistema gera um token seguro (válido por 1 hora)
3. Use `POST /api/auth/reset-password` com o token e nova senha
4. O token é invalidado após uso

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

- **Email**: lukas.enginer7@gmail.com
- **Website**: https://lukaszwx.github.io/my-portfolio/
- **Instagram**: @xwz.lucs  

---

projeto pensado e criado por Lucas Neves