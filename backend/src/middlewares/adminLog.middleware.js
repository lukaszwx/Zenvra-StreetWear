import { createAdminLog } from "../services/auth.service.js";

export function adminLogMiddleware(action) {
  return async (req, res, next) => {
    // Continue com a requisição normalmente
    const originalSend = res.send;
    
    res.send = function(data) {
      // Se a resposta for bem-sucedida, loga a ação
      if (res.statusCode >= 200 && res.statusCode < 300) {
        createAdminLog(action, {
          userId: req.user?.id,
          userEmail: req.user?.email,
          ip: req.ip,
          userAgent: req.get("User-Agent"),
          method: req.method,
          url: req.originalUrl,
          timestamp: new Date().toISOString()
        }).catch(console.error);
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
}

export async function adminLog(action, details) {
  try {
    await createAdminLog(action, {
      ...details,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erro ao criar log administrativo:", error);
  }
}
