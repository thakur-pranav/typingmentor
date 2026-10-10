import nodemailer from "nodemailer";

let transporter = null;

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

    const mailTransporter = getTransporter();

    if (mailTransporter) {
      try {
        await mailTransporter.sendMail({
          from: process.env.SMTP_FROM || `"TypingMentor" <no-reply@typingmentor.com>`,
          to,
          subject: "Verify your email address — TypingMentor",
          text: `Hi ${username},

Welcome to TypingMentor! Please verify your email to activate your account and start competing on the global leaderboard:

${verificationUrl}

This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.

— The TypingMentor Team`,
          html: `
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
          `,
        });
        return;
      } catch (err) {
        console.error("Failed to send verification email via SMTP:", err.message);
      }
    }

    // In development / local testing or when SMTP is not configured:
    console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📧 [DEV EMAIL] To: ${to.padEnd(58)}│
│ Subject: Verify your TypingMentor email address                             │
│ Link: ${verificationUrl.padEnd(68)}│
└─────────────────────────────────────────────────────────────────────────────┘
`);
  },
};
