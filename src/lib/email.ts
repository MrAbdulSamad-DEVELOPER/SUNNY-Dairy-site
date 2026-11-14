import nodemailer from 'nodemailer';

export const ADMIN_RECOVERY_EMAIL = 'sanaullah.ccs@gmail.com';

interface SendPasswordResetParams {
  toEmail: string;
  adminUsername: string;
  resetCode: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({
  toEmail,
  adminUsername,
  resetCode,
  resetUrl,
}: SendPasswordResetParams): Promise<{ success: boolean; simulated?: boolean; messageId?: string; error?: string }> {
  const targetRecipient = ADMIN_RECOVERY_EMAIL || toEmail;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F5F1E8; margin: 0; padding: 24px; color: #1B3B2B; }
    .card { max-width: 540px; margin: 0 auto; background: #FFFDFA; border: 1px solid #E6DCC8; border-radius: 20px; padding: 32px; box-shadow: 0 4px 20px rgba(27, 59, 43, 0.08); }
    .header { text-align: center; border-bottom: 1px solid #E6DCC8; padding-bottom: 20px; margin-bottom: 24px; }
    .logo-text { font-size: 22px; font-weight: bold; color: #1B3B2B; letter-spacing: 0.5px; }
    .gold-subtitle { font-size: 11px; text-transform: uppercase; font-weight: bold; color: #C5A059; letter-spacing: 2px; margin-top: 4px; }
    .title { font-size: 20px; font-weight: bold; color: #1B3B2B; margin-top: 0; margin-bottom: 8px; }
    .code-box { background: #F5F1E8; border: 2px dashed #C5A059; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
    .code { font-family: Courier, monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1B3B2B; }
    .button-container { text-align: center; margin: 28px 0; }
    .btn { background-color: #1B3B2B; color: #FFFFFF !important; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block; }
    .footer { font-size: 12px; color: #6E7E73; border-top: 1px solid #E6DCC8; padding-top: 18px; margin-top: 24px; line-height: 1.5; }
    .warning { font-size: 11px; color: #8A4B38; background: #FFF4E5; padding: 10px; border-radius: 8px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo-text">SUNNY Dairy</div>
      <div class="gold-subtitle">Official Administrative Security</div>
    </div>

    <h2 class="title">Password Reset Request</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #334D3D;">
      A password reset request was initiated for administrator account <strong>@${adminUsername}</strong>.
    </p>

    <p style="font-size: 13px; color: #4B6354;">
      Use the secure 6-digit verification code below to authorize your password change, or click the direct reset button:
    </p>

    <div class="code-box">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #6E7E73; margin-bottom: 6px;">Your 6-Digit Verification Code</div>
      <div class="code">${resetCode}</div>
      <div style="font-size: 11px; color: #6E7E73; margin-top: 6px;">Valid for 30 minutes</div>
    </div>

    <div class="button-container">
      <a href="${resetUrl}" class="btn" target="_blank">Reset Password Now →</a>
    </div>

    <div class="warning">
      If you did not request this password reset, please ignore this email or review your admin security logs immediately.
    </div>

    <div class="footer">
      SUNNY Dairy Operations Center &middot; Dera Ismail Khan, KP, Pakistan<br />
      Protected by 256-bit cryptographic session signatures.
    </div>
  </div>
</body>
</html>
  `;

  // 1. Check if SMTP credentials exist in environment
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || `"SUNNY Dairy Security" <${smtpUser}>`,
        to: targetRecipient,
        subject: `[SUNNY Dairy] Admin Password Reset Code: ${resetCode}`,
        text: `SUNNY Dairy Admin Password Reset\n\nAdmin: @${adminUsername}\nCode: ${resetCode}\nReset Link: ${resetUrl}\nValid for 30 minutes.`,
        html: htmlContent,
      });

      console.log(`[EMAIL DISPATCHED] Password reset email sent via SMTP to ${targetRecipient}. ID: ${info.messageId}`);
      return { success: true, simulated: false, messageId: info.messageId };
    } catch (smtpErr: any) {
      console.error('[SMTP FAILED, FALLING BACK TO SECURE LOG]:', smtpErr.message);
    }
  }

  // 2. Simulated/Local fallback when SMTP credentials are not configured
  console.log(`
===========================================================
[PASSWORD RESET EMAIL SIMULATION]
To: ${targetRecipient}
Admin: @${adminUsername}
Code: ${resetCode}
Reset Link: ${resetUrl}
Expires: 30 minutes
===========================================================
  `);

  return {
    success: true,
    simulated: true,
  };
}
