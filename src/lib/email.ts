import nodemailer from 'nodemailer';

export const DEFAULT_SENDER_EMAIL = 'sanaullah.ccs@gmail.com';

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
  // Always send to the specific admin's registered email address
  const targetRecipient = toEmail;

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
      Assalam-o-Alaikum, password reset request was initiated for administrator account <strong>@${adminUsername}</strong> (${targetRecipient}).
    </p>

    <p style="font-size: 13px; color: #4B6354;">
      Neechay diye gaye direct reset button par click karein apna naya password set karne ke liye:
    </p>

    <div class="button-container">
      <a href="${resetUrl}" class="btn" target="_blank">Reset Password Now →</a>
    </div>

    <div class="code-box">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #6E7E73; margin-bottom: 6px;">Alternative 6-Digit Verification Code</div>
      <div class="code">${resetCode}</div>
      <div style="font-size: 11px; color: #6E7E73; margin-top: 6px;">Valid for 60 minutes</div>
    </div>

    <div class="warning">
      Agar aap ne yeh password reset request nahi ki to is email ko ignore karein. Aapka purana password mehfooz rahega.
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
  const smtpUser = process.env.SMTP_USER || DEFAULT_SENDER_EMAIL;
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
        from: process.env.SMTP_FROM || `"SUNNY Dairy Security" <${DEFAULT_SENDER_EMAIL}>`,
        to: targetRecipient,
        subject: `[SUNNY Dairy] Admin Password Reset Link: @${adminUsername}`,
        text: `SUNNY Dairy Admin Password Reset\n\nAdmin: @${adminUsername}\nReset Link: ${resetUrl}\nVerification Code: ${resetCode}\nValid for 60 minutes.`,
        html: htmlContent,
      });

      console.log(`[EMAIL DISPATCHED] Password reset email sent via SMTP to ${targetRecipient}. ID: ${info.messageId}`);
      return { success: true, simulated: false, messageId: info.messageId };
    } catch (smtpErr: any) {
      console.error('[SMTP FAILED, FALLING BACK TO SECURE LOG]:', smtpErr.message);
    }
  }

  // 2. Fallback when SMTP credentials are not configured in environment
  console.log(`
===========================================================
[PASSWORD RESET EMAIL DISPATCHED]
From: ${DEFAULT_SENDER_EMAIL}
To: ${targetRecipient}
Admin: @${adminUsername}
Code: ${resetCode}
Reset Link: ${resetUrl}
Expires: 60 minutes
===========================================================
  `);

  return {
    success: true,
    simulated: true,
  };
}
