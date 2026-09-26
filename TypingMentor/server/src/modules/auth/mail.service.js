import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return transporter;
}

export const mailService = {
  async sendVerificationEmail({ to, username, token }) {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const verificationUrl = `${clientUrl}/verify-email?token=${token}`;

    const mailTransporter = getTransporter();

    if (mailTransporter) {
      try {
        await mailTransporter.sendMail({
          from: process.env.SMTP_FROM || `"TypingMentor" <no-reply@typingmentor.com>`,
          to,
          subject: "Verify your TypingMentor email address",
          html: `
            <div style="font-family: sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 2px solid #0d0d0d; background: #ffffff;">
              <h1 style="font-size: 24px; font-weight: 900; text-transform: uppercase; color: #0d0d0d; margin-bottom: 8px;">
                ⌨️ TypingMentor
              </h1>
              <p style="font-size: 16px; color: #333333; margin-bottom: 24px;">
                Hi <strong>${username}</strong>, thanks for joining TypingMentor! Please verify your email to activate your account and start competing on the leaderboard.
              </p>
              <div style="margin: 28px 0;">
                <a href="${verificationUrl}" style="background-color: #ffd60a; color: #0d0d0d; border: 2px solid #0d0d0d; padding: 12px 24px; font-weight: 800; font-size: 14px; text-transform: uppercase; text-decoration: none; display: inline-block; box-shadow: 2px 2px 0 #0d0d0d;">
                  Verify Email Address
                </a>
              </div>
              <p style="font-size: 13px; color: #777777; margin-top: 24px;">
                Or copy and paste this link in your browser:<br/>
                <a href="${verificationUrl}" style="color: #0d0d0d; word-break: break-all;">${verificationUrl}</a>
              </p>
              <p style="font-size: 12px; color: #999999; margin-top: 20px;">
                This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.
              </p>
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
