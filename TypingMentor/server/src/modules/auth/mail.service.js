import nodemailer from "nodemailer";

let transporter = null;

function parseSender(fromStr) {
  if (!fromStr) {
    return { name: "TypingMentor", email: "support@byteforgelabs.tech" };
  }
  const match = fromStr.match(/(?:"?([^"]*)"?\s)?(?:<?([^<>\s]+@[^<>\s]+)>?)/);
  if (match) {
    return {
      name: (match[1] || "TypingMentor").trim(),
      email: (match[2] || fromStr).trim(),
    };
  }
  return { name: "TypingMentor", email: fromStr.trim() };
}

async function sendViaBrevoApi({ to, subject, html, text, replyTo = null }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return false;

  const sender = parseSender(process.env.SMTP_FROM);

  const payload = {
    sender,
    to: [{ email: to }],
    subject,
    htmlContent: html,
    textContent: text,
  };

  if (replyTo) {
    payload.replyTo = { email: replyTo };
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`Brevo API (${res.status}): ${JSON.stringify(errorData)}`);
  }

  return true;
}

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    if (host.includes("gmail") || process.env.SMTP_SERVICE === "gmail") {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
      });
    } else {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    }
  }

  return transporter;
}

export const mailService = {
  async sendVerificationEmail({ to, username, token }) {
    if (process.env.NODE_ENV === "test") {
      return;
    }

    const clientUrl = (process.env.CLIENT_URL || "http://localhost:3000").replace(/\/+$/, "");
    const verificationUrl = `${clientUrl}/verify-email?token=${token}`;

    const textContent = `Hi ${username},

Welcome to TypingMentor! Please verify your email to activate your account and start competing on the global leaderboard:

${verificationUrl}

This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.

— The TypingMentor Team`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; border: 3px solid #0d0d0d; background: #ffffff; box-shadow: 4px 4px 0 #0d0d0d;">
        <div style="border-bottom: 2px solid #0d0d0d; padding-bottom: 16px; margin-bottom: 24px;">
          <span style="font-size: 22px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; color: #0d0d0d; display: inline-block;">
            ⌨️ TYPINGMENTOR
          </span>
        </div>
        <h2 style="font-size: 18px; font-weight: 800; color: #0d0d0d; margin: 0 0 16px 0; text-transform: uppercase;">
          Verify Your Email Address
        </h2>
        <p style="font-size: 15px; line-height: 1.6; color: #333333; margin: 0 0 24px 0;">
          Hi <strong>${username}</strong>, thanks for joining TypingMentor! Please verify your email to activate your account and start competing on the global leaderboard.
        </p>
        <div style="margin: 28px 0;">
          <a href="${verificationUrl}" style="background-color: #ffd60a; color: #0d0d0d; border: 2px solid #0d0d0d; padding: 14px 28px; font-weight: 900; font-size: 13px; text-transform: uppercase; text-decoration: none; display: inline-block; box-shadow: 3px 3px 0 #0d0d0d; letter-spacing: 0.5px;">
            Verify Email Address &rarr;
          </a>
        </div>
        <p style="font-size: 13px; line-height: 1.6; color: #666666; margin: 24px 0 0 0;">
          Or copy and paste this link in your browser:<br/>
          <a href="${verificationUrl}" style="color: #0d0d0d; font-weight: 700; word-break: break-all;">${verificationUrl}</a>
        </p>
        <div style="border-top: 1px solid #e5e5e5; margin-top: 28px; padding-top: 16px;">
          <p style="font-size: 12px; color: #888888; margin: 0;">
            This link will expire in 24 hours. If you did not create a TypingMentor account, you can safely ignore this email.
          </p>
        </div>
      </div>
    `;

    // 1. Try Brevo HTTPS REST API first (bypasses Render SMTP port blocking)
    if (process.env.BREVO_API_KEY) {
      try {
        await sendViaBrevoApi({
          to,
          subject: "Verify your email address — TypingMentor",
          html: htmlContent,
          text: textContent,
        });
        return;
      } catch (err) {
        console.error("Failed to send verification email via Brevo API:", err.message);
      }
    }

    // 2. Fallback to standard SMTP (Nodemailer)
    const mailTransporter = getTransporter();
    if (mailTransporter) {
      try {
        await mailTransporter.sendMail({
          from: process.env.SMTP_FROM || `"TypingMentor" <no-reply@typingmentor.com>`,
          to,
          subject: "Verify your email address — TypingMentor",
          text: textContent,
          html: htmlContent,
        });
        return;
      } catch (err) {
        console.error("Failed to send verification email via SMTP:", err.message);
      }
    }

    // 3. In development / local testing or when no provider is configured:
    console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📧 [DEV EMAIL] To: ${to.padEnd(58)}│
│ Subject: Verify your TypingMentor email address                             │
│ Link: ${verificationUrl.padEnd(68)}│
└─────────────────────────────────────────────────────────────────────────────┘
`);
  },

  async sendFeedbackNotification({ name, email, category, subject, message }) {
    if (process.env.NODE_ENV === "test") {
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL || "byteforgelabs.app@gmail.com";
    const categoryLabel = category.toUpperCase();

    const categoryColors = {
      suggestion: "#ffd60a",
      bug: "#ff4d6d",
      query: "#00b4d8",
    };
    const badgeColor = categoryColors[category] || "#ffd60a";

    const textContent = `New Feedback from ${name} (${email})
Category: ${categoryLabel}
Subject: ${subject}

Message:
${message}
`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 3px solid #0d0d0d; background: #ffffff; box-shadow: 4px 4px 0 #0d0d0d;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 2px solid #0d0d0d; padding-bottom: 16px; margin-bottom: 24px; width: 100%;">
          <tr>
            <td align="left" valign="middle">
              <h1 style="font-size: 20px; font-weight: 900; text-transform: uppercase; margin: 0; color: #0d0d0d; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                TypingMentor Feedback
              </h1>
            </td>
            <td align="right" valign="middle" style="padding-left: 20px;">
              <span style="display: inline-block; background-color: ${badgeColor}; color: #0d0d0d; border: 2px solid #0d0d0d; padding: 4px 12px; font-weight: 900; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                ${categoryLabel}
              </span>
            </td>
          </tr>
        </table>
        
        <div style="background-color: #f4f1ea; border: 2px solid #0d0d0d; padding: 16px; margin-bottom: 20px;">
          <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>From:</strong> ${name} &lt;<a href="mailto:${email}" style="color: #0d0d0d;">${email}</a>&gt;</p>
          <p style="margin: 0; font-size: 13px;"><strong>Subject:</strong> ${subject}</p>
        </div>

        <div style="margin: 24px 0;">
          <h2 style="font-size: 12px; font-weight: 900; text-transform: uppercase; color: #666666; margin: 0 0 8px 0; letter-spacing: 0.5px;">
            User Message:
          </h2>
          <div style="background: #ffffff; border: 2px solid #0d0d0d; padding: 18px; font-size: 14px; line-height: 1.6; color: #111111; white-space: pre-wrap;">
${message}
          </div>
        </div>

        <div style="border-top: 1px solid #e5e5e5; margin-top: 28px; padding-top: 16px;">
          <p style="font-size: 12px; color: #888888; margin: 0;">
            Click "Reply" to respond directly to ${email}.
          </p>
        </div>
      </div>
    `;

    // 1. Try Brevo HTTPS REST API first (bypasses Render SMTP port blocking)
    if (process.env.BREVO_API_KEY) {
      try {
        await sendViaBrevoApi({
          to: adminEmail,
          replyTo: email,
          subject: `[TypingMentor ${categoryLabel}] ${subject}`,
          html: htmlContent,
          text: textContent,
        });
        return;
      } catch (err) {
        console.error("Failed to send feedback notification via Brevo API:", err.message);
      }
    }

    // 2. Fallback to standard SMTP (Nodemailer)
    const mailTransporter = getTransporter();
    if (mailTransporter) {
      try {
        await mailTransporter.sendMail({
          from: process.env.SMTP_FROM || `"TypingMentor Support" <byteforgelabs.app@gmail.com>`,
          to: adminEmail,
          replyTo: email,
          subject: `[TypingMentor ${categoryLabel}] ${subject}`,
          text: textContent,
          html: htmlContent,
        });
        return;
      } catch (err) {
        console.error("Failed to send feedback email via SMTP:", err.message);
      }
    }

    // 3. In development / local testing or when no provider is configured:
    console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ 💬 [DEV FEEDBACK NOTIFICATION]                                             │
│ Category: ${categoryLabel.padEnd(64)}│
│ From:     ${name} <${email}>
│ Subject:  ${subject}
│ Message:  ${message.substring(0, 50)}...
└─────────────────────────────────────────────────────────────────────────────┘
`);
  },
};

