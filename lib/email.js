import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendEmail({ to, subject, html }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log("[Email] Not configured — skipping:", subject, "→", to);
    return;
  }
  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || '"DBU Homebrew" <noreply@dbuhomebrew.com>',
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("[Email] Send failed:", err.message);
  }
}
