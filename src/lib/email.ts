import nodemailer from 'nodemailer';

export const DEFAULT_SENDER_EMAIL = 'mr.abdulsamadabdullah@gmail.com';
export const DEFAULT_SMTP_PASS = 'wsumlrbktkvmejbx';

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
  const targetRecipient = toEmail;

  // Clean, high-deliverability transactional HTML template
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SUNNY Dairy Verification Code</title>
</head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F5F1E8; color: #1B3B2B;">
  <!-- Preheader preview text for Gmail inbox snippet -->
  <div style="display: none; font-size: 1px; color: #F5F1E8; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Your SUNNY Dairy password reset code is ${resetCode}. Use this code or click the link to reset your account password.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F5F1E8;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 540px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E6DCC8; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(27, 59, 43, 0.06);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 28px 24px 20px; border-bottom: 2px solid #C5A059; background: #FFFFFF;">
              <div style="font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #1B3B2B; letter-spacing: 0.5px;">
                SUNNY Dairy
              </div>
              <div style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #C5A059; letter-spacing: 2px; margin-top: 4px;">
                Pure &amp; Farm Fresh &middot; Operations Security
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 28px;">
              <h1 style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #1B3B2B; margin-top: 0; margin-bottom: 12px;">
                Administrator Password Reset
              </h1>
              
              <p style="font-size: 14px; line-height: 1.6; color: #334D3D; margin-top: 0; margin-bottom: 20px;">
                Hello <strong>@${adminUsername}</strong>,
              </p>

              <p style="font-size: 14px; line-height: 1.6; color: #334D3D; margin-top: 0; margin-bottom: 24px;">
                We received a request to reset the password for your administrator account (<strong>${targetRecipient}</strong>). Use the verification code below to complete the reset:
              </p>

              <!-- Verification Code Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
                <tr>
                  <td align="center" style="background-color: #F8F5EE; border: 2px dashed #C5A059; border-radius: 12px; padding: 20px 16px;">
                    <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; color: #6E7E73; margin-bottom: 8px;">
                      Your 6-Digit Verification Code
                    </div>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: bold; letter-spacing: 8px; color: #1B3B2B;">
                      ${resetCode}
                    </div>
                    <div style="font-size: 11px; color: #6E7E73; margin-top: 8px;">
                      This code is valid for 60 minutes.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Direct Reset Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0 20px;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #1B3B2B; color: #FFFFFF; font-size: 14px; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 10px; border: 1px solid #1B3B2B;">
                      Reset Password Now &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; line-height: 1.5; color: #6E7E73; margin-top: 16px; margin-bottom: 0; word-break: break-all;">
                Or copy and paste this direct link into your browser:<br />
                <a href="${resetUrl}" style="color: #1B3B2B; text-decoration: underline;">${resetUrl}</a>
              </p>

              <!-- Security notice -->
              <div style="background-color: #FFF8EE; border: 1px solid #F0DEB4; border-radius: 8px; padding: 12px 14px; margin-top: 24px; font-size: 12px; line-height: 1.5; color: #7A5310;">
                <strong>Security Reminder:</strong> If you did not make this request, you can safely ignore this email. Your current administrator password will remain secure and unchanged.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 28px 24px; border-top: 1px solid #E6DCC8; background-color: #FAF7F0; font-size: 11px; line-height: 1.5; color: #6E7E73; text-align: center;">
              <strong>SUNNY Dairy Operations Center</strong> &middot; Dera Ismail Khan, KP, Pakistan<br />
              This is a secure automated notification regarding your SUNNY Dairy administrator account.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain-text counterpart (Crucial for SpamAssassin / Gmail SPF / MIME ratio score)
  const textContent = `
SUNNY Dairy Administrator Password Reset
=========================================

Hello @${adminUsername},

We received a request to reset the password for your administrator account (${targetRecipient}).

Your 6-Digit Verification Code:
-------------------------------
${resetCode}
-------------------------------
(This code is valid for 60 minutes)

You can also use this direct link to set your new password:
${resetUrl}

Security Reminder:
If you did not request this password reset, please ignore this email. Your current administrator password will remain secure and unchanged.

SUNNY Dairy Operations Center
Dera Ismail Khan, KP, Pakistan
Pure & Farm Fresh Dairy
  `.trim();

  // 1. Check if SMTP credentials exist in environment
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
  const smtpUser = process.env.SMTP_USER || DEFAULT_SENDER_EMAIL;
  const smtpPass = (process.env.SMTP_PASS || DEFAULT_SMTP_PASS).replace(/\s+/g, '');

  if (smtpPass) {
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
        from: `"SUNNY Dairy Security" <${smtpUser}>`,
        to: targetRecipient,
        replyTo: `"SUNNY Dairy Support" <${smtpUser}>`,
        subject: `Your SUNNY Dairy verification code: ${resetCode}`,
        text: textContent,
        html: htmlContent,
        priority: 'high',
        headers: {
          'X-Priority': '1',
          'Importance': 'high',
          'X-MSMail-Priority': 'High',
          'X-Entity-Ref-ID': `sunny-reset-${Date.now()}`,
        },
      });

      console.log(`[EMAIL DISPATCHED] Password reset email sent via SMTP from ${smtpUser} to ${targetRecipient}. ID: ${info.messageId}`);
      return { success: true, simulated: false, messageId: info.messageId };
    } catch (smtpErr: any) {
      console.error('[SMTP FAILED]:', smtpErr.message);
      return { success: false, error: smtpErr.message };
    }
  }

  // 2. Fallback log when SMTP password is not yet configured in environment
  console.log(`
===========================================================
[PASSWORD RESET EMAIL DISPATCHED]
From: ${smtpUser}
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
