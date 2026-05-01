export function validateRoute(req, res, next) {
  const path = req.path;
  const method = req.method;
  
  // Log da rota para debugging
  console.log(`🔍 Route Validation: ${method} ${path}`);
  
  // Verificar se é uma rota de API
  if (!path.startsWith('/api/')) {
    return next();
  }
  
  // Validações básicas de segurança
  if (path.includes('..') || path.includes('//')) {
    return res.status(400).json({
      error: 'Invalid route format',
      message: 'Rota inválida'
    });
  }
  
  // Verificar tamanho máximo da URL
  if (path.length > 1000) {
    return res.status(414).json({
      error: 'URI too long',
      message: 'URL muito longa'
    });
  }
  
  // Log de sucesso
  console.log(`✅ Route Validated: ${method} ${path}`);
  next();
}

export function validateRequestBody(req, res, next) {
  if (req.method === 'GET' || req.method === 'DELETE') {
    return next();
  }
  
  try {
    // Verificar Content-Type para requisições com body
    if (req.body && !req.is('json') && !req.is('multipart/form-data')) {
      return res.status(400).json({
        error: 'Invalid content type',
        message: 'Content-Type deve ser application/json ou multipart/form-data'
      });
    }
    
    // Verificar tamanho do body
    const contentLength = req.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB
      return res.status(413).json({
        error: 'Request entity too large',
        message: 'Corpo da requisição muito grande'
      });
    }
    
    next();
  } catch (error) {
    console.error('❌ Body Validation Error:', error);
    return res.status(400).json({
      error: 'Invalid request body',
      message: 'Corpo da requisição inválido'
    });
  }
}

export function sanitizeInput(req, res, next) {
  try {
    // Sanitizar query params
    if (req.query) {
      for (const key in req.query) {
        if (typeof req.query[key] === 'string') {
          req.query[key] = req.query[key].trim().substring(0, 1000);
        }
      }
    }
    
    // Sanitizar params
    if (req.params) {
      for (const key in req.params) {
        if (typeof req.params[key] === 'string') {
          req.params[key] = req.params[key].trim().substring(0, 100);
        }
      }
    }
    
    next();
  } catch (error) {
    console.error('❌ Input Sanitization Error:', error);
    return res.status(400).json({
      error: 'Invalid input',
      message: 'Dados de entrada inválidos'
    });
  }
}
