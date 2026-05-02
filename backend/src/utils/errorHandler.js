export class AppError extends Error {
  constructor(message, statusCode, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.stack = stack;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log do erro
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // Erro de chave duplicada do Mongoose
  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Valor duplicado: ${value}. Por favor, use outro valor.`;
    error = new AppError(message, 400);
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido. Faça login novamente.';
    error = new AppError(message, 401);
  }

  // Erro de JWT expirado
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado. Faça login novamente.';
    error = new AppError(message, 401);
  }

  // Erro de sintaxe SQL
  if (err.code === 'SQLITE_ERROR') {
    const message = 'Erro no banco de dados. Por favor, tente novamente.';
    error = new AppError(message, 500);
  }

  // Erro de conexão
  if (err.code === 'ECONNREFUSED') {
    const message = 'Erro de conexão. Servidor indisponível.';
    error = new AppError(message, 503);
  }

  // Erro de CORS
  if (err.message.includes('CORS')) {
    const message = 'Origem não permitida.';
    error = new AppError(message, 403);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const notFound = (req, res, next) => {
  const error = new AppError(`Rota não encontrada - ${req.originalUrl}`, 404);
  next(error);
};
