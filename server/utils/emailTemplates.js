/**
 * TriggerPulse⚡ — Professional Email Templates
 * Sender: onboarding@resend.dev (Resend free tier)
 * Credits: Built by owsam22
 */

/**
 * Generates the HTML for the email verification email.
 * @param {string} verificationUrl - The full URL the user must click
 * @param {string} userEmail - The recipient's email address
 * @returns {{ subject: string, html: string }}
 */
function getVerificationEmailTemplate(verificationUrl, userEmail) {
  const subject = 'Verify your TriggerPulse⚡ account';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Verify your TriggerPulse account</title>

<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #0f0f1a;
    font-family: Arial, sans-serif;
  }

  table {
    border-spacing: 0;
  }

  .container {
    width: 100%;
    padding: 20px 10px;
  }

  .card {
    max-width: 540px;
    margin: 0 auto;
    background: #1a1a2e;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #2a2a40;
  }

  .header {
    background: #4f46e5;
    padding: 30px 20px;
    text-align: center;
  }

  .brand {
    color: #ffffff;
    font-size: 20px;
    font-weight: bold;
  }

  .tagline {
    color: #d1d1ff;
    font-size: 13px;
    margin-top: 6px;
  }

  .body {
    padding: 30px 22px;
    color: #d1d1e0;
  }

  .title {
    font-size: 22px;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 12px;
  }

  .text {
    font-size: 14px;
    line-height: 1.6;
    color: #a0a0c0;
  }

  .email {
    color: #818cf8;
    font-weight: bold;
  }

  .divider {
    height: 1px;
    background: #2a2a40;
    margin: 24px 0;
  }

  .button-wrap {
    text-align: center;
    margin: 28px 0;
  }

  .button {
    background: #4f46e5;
    color: #ffffff !important;
    text-decoration: none;
    padding: 14px 30px;
    border-radius: 8px;
    display: inline-block;
    font-weight: bold;
    font-size: 14px;
  }

  .expiry {
    text-align: center;
    font-size: 13px;
    color: #8888aa;
    margin-top: 10px;
  }

  .link-box {
    background: #141427;
    padding: 14px;
    border-radius: 6px;
    margin-top: 20px;
    font-size: 12px;
    word-break: break-all;
    color: #818cf8;
  }

  .security {
    margin-top: 20px;
    font-size: 13px;
    color: #6b6b8a;
    line-height: 1.6;
  }

  .footer {
    text-align: center;
    padding: 24px 20px;
    font-size: 12px;
    color: #6b6b8a;
    border-top: 1px solid #2a2a40;
  }

  .footer strong {
    color: #8d97f8ff;
  }

  @media screen and (max-width: 480px) {
    .body {
      padding: 20px 16px;
    }
    .title {
      font-size: 20px;
    }
  }
</style>
</head>

<body>

<table class="container" width="100%">
<tr>
<td align="center">

<table class="card" width="100%">

  <!-- HEADER -->
  <tr>
    <td class="header">
      <div class="brand">⚡ TriggerPulse</div>
      <div class="tagline">Keep your backends alive, always.</div>
    </td>
  </tr>

  <!-- BODY -->
  <tr>
    <td class="body">

      <div class="title">Verify your email 🎉</div>

      <p class="text">
        Thanks for signing up! You're almost ready to start keeping your backends alive.
        Just verify your email address and you'll be good to go.
      </p>

      <p class="text" style="margin-top:10px;">
        Your account email: <span class="email">${userEmail}</span>
      </p>

      <div class="divider"></div>

      <!-- CTA -->
      <div class="button-wrap">
        <a href="${verificationUrl}" class="button">
          ✅ Verify My Email
        </a>
      </div>

      <div class="expiry">
        This link expires in <strong>10 minutes</strong>. Don't keep it waiting!
      </div>

      <!-- ALT LINK -->
      <div class="link-box">
        ${verificationUrl}
      </div>

      <!-- SECURITY -->
      <div class="security">
        🔒 If you didn't create a TriggerPulse account, you can safely ignore this email.
        No action is required. This link can only be used once.
      </div>

    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td class="footer">
      <strong>TriggerPulse ⚡</strong><br/><br/>
      Automatic backend URL triggering to prevent cold starts<br/>
      on free hosting services.<br/><br/>

      Built with ❤️ by owsam22<br/><br/>

      You received this email because you signed up for TriggerPulse.<br/>
      © ${new Date().getFullYear()} TriggerPulse. All rights reserved.
    </td>
  </tr>

</table>

</td>
</tr>
</table>

</body>
</html>
  `.trim();

  return { subject, html };
}

module.exports = { getVerificationEmailTemplate };
