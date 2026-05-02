import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.warn("[email] SMTP não configurado. Verifique SMTP_HOST, SMTP_USER e SMTP_PASS.");
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendResetPasswordEmail(to, resetLink) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP não configurado.");
  }

  return transporter.sendMail({
    from: `"Zenvra" <${SMTP_USER}>`,
    to,
    subject: "Redefinição de senha",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; color: #111827;">
        <h2>Redefinição de senha</h2>
        <p>Você solicitou a redefinição da sua senha.</p>
        <p>Clique no link abaixo para continuar:</p>
        <p>
          <a href="${resetLink}" style="color: #10b981; font-weight: bold;">
            Redefinir senha
          </a>
        </p>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou, ignore este e-mail.</p>
      </div>
    `,
  });
}

export async function sendAdminInviteEmail(to, inviteLink) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP não configurado.");
  }

  return transporter.sendMail({
    from: `"Zenvra" <${SMTP_USER}>`,
    to,
    subject: "Convite para Administrador Zenvra",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; color: #111827; background: #f9fafb; padding: 20px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #10b981; margin: 0;">Zenvra</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Streetwear Premium</p>
        </div>
        
        <h2 style="color: #111827;">Você foi convidado para ser Administrador!</h2>
        
        <p style="color: #4b5563; line-height: 1.6;">
          Você recebeu um convite para se tornar administrador da Zenvra. 
          Esta é uma oportunidade exclusiva para gerenciar produtos e administrar nossa plataforma.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteLink}" 
             style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 6px; font-weight: bold;">
            Ativar Minha Conta
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          Este link expira em <strong>48 horas</strong>. Após este período, 
          você precisará solicitar um novo convite.
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            Se você não estava esperando este convite, pode ignorar este e-mail com segurança.
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
            © ${new Date().getFullYear()} Zenvra. Todos os direitos reservados.
          </p>
        </div>
      </div>
    `,
  });
}