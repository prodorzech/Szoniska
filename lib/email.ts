import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.EMAIL_FROM || 'verify@szoniska.pl';

export async function sendVerificationEmail(email: string, token: string, name?: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weryfikacja konta - Szoniska</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #1a0033 0%, #000000 50%, #001a33 100%);">
      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a0033 0%, #000000 50%, #001a33 100%); padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%); border-radius: 16px; border: 1px solid rgba(168, 85, 247, 0.2); box-shadow: 0 20px 60px rgba(168, 85, 247, 0.3); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(90deg, #7c3aed 0%, #4f46e5 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
                    🎮 Szoniska
                  </h1>
                  <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                    Platforma społeczności gaming
                  </p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 50px 40px;">
                  <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">
                    ${name ? `Witaj, ${name}! 👋` : 'Witaj! 👋'}
                  </h2>
                  
                  <p style="color: rgba(255,255,255,0.85); font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                    Dziękujemy za rejestrację na platformie <strong style="color: #a855f7;">Szoniska</strong>! 
                    Aby dokończyć proces rejestracji i aktywować swoje konto, musisz potwierdzić swój adres email.
                  </p>

                  <p style="color: rgba(255,255,255,0.85); font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Twój kod weryfikacyjny:
                  </p>

                  <!-- Verification Code -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 30px 0;">
                    <tr>
                      <td align="center" style="padding: 20px; background: rgba(168, 85, 247, 0.1); border: 2px dashed #a855f7; border-radius: 12px;">
                        <span style="font-size: 36px; font-weight: 700; color: #a855f7; letter-spacing: 8px; font-family: 'Courier New', monospace; text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);">
                          ${token}
                        </span>
                      </td>
                    </tr>
                  </table>

                  <!-- Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${verificationUrl}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(90deg, #7c3aed 0%, #a855f7 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4); transition: all 0.3s;">
                          ✨ Potwierdź email
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                    Możesz też skopiować kod powyżej i wkleić go na stronie weryfikacji.
                  </p>

                  <!-- Warning -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0 0 0;">
                    <tr>
                      <td style="padding: 20px; background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; border-radius: 8px;">
                        <p style="color: rgba(255,255,255,0.85); font-size: 14px; line-height: 1.6; margin: 0;">
                          ⚠️ <strong>Uwaga:</strong> Ten link wygasa za <strong>24 godziny</strong>. 
                          Jeśli nie weryfikowałeś tego konta, zignoruj tę wiadomość.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(168, 85, 247, 0.2);">
                  <p style="color: rgba(255,255,255,0.5); font-size: 13px; line-height: 1.6; margin: 0 0 10px 0; text-align: center;">
                    © ${new Date().getFullYear()} Szoniska. Wszystkie prawa zastrzeżone.
                  </p>
                  <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0; text-align: center;">
                    To jest automatyczna wiadomość. Prosimy nie odpowiadać na ten email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: `Szoniska 🎮 <${fromEmail}>`,
    to: email,
    subject: '🎮 Potwierdź swój email - Szoniska',
    html: htmlContent,
  });
}

export async function sendPasswordResetEmail(email: string, token: string, name?: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset hasła - Szoniska</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #1a0033 0%, #000000 50%, #001a33 100%);">
      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a0033 0%, #000000 50%, #001a33 100%); padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%); border-radius: 16px; border: 1px solid rgba(168, 85, 247, 0.2); box-shadow: 0 20px 60px rgba(168, 85, 247, 0.3); overflow: hidden;">
              
              <tr>
                <td style="background: linear-gradient(90deg, #7c3aed 0%, #4f46e5 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
                    🎮 Szoniska
                  </h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 50px 40px;">
                  <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">
                    ${name ? `Cześć, ${name}! 🔒` : 'Reset hasła 🔒'}
                  </h2>
                  
                  <p style="color: rgba(255,255,255,0.85); font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta. 
                    Kliknij poniższy przycisk, aby ustawić nowe hasło:
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${resetUrl}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(90deg, #7c3aed 0%, #a855f7 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4);">
                          🔑 Zresetuj hasło
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                    Jeśli przycisk nie działa, skopiuj poniższy link i wklej go w przeglądarce:
                  </p>
                  <p style="color: rgba(168, 85, 247, 0.8); font-size: 12px; line-height: 1.6; margin: 10px 0 0 0; text-align: center; word-break: break-all;">
                    ${resetUrl}
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0 0 0;">
                    <tr>
                      <td style="padding: 20px; background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; border-radius: 8px;">
                        <p style="color: rgba(255,255,255,0.85); font-size: 14px; line-height: 1.6; margin: 0;">
                          ⚠️ Ten link wygasa za <strong>1 godzinę</strong>. 
                          Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding: 30px 40px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(168, 85, 247, 0.2);">
                  <p style="color: rgba(255,255,255,0.5); font-size: 13px; text-align: center; margin: 0;">
                    © ${new Date().getFullYear()} Szoniska
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: `Szoniska 🎮 <${fromEmail}>`,
    to: email,
    subject: '🔒 Reset hasła - Szoniska',
    html: htmlContent,
  });
}
