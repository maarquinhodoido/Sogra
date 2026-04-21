import nodemailer from "nodemailer";

type MailPayload = {
  to: string;
  subject: string;
  html: string;
};

function getTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export async function sendEmail(payload: MailPayload) {
  const transport = getTransport();

  if (!transport) {
    console.info("Email fallback", payload);
    return { delivered: false, mode: "log" as const };
  }

  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });

  return { delivered: true, mode: "smtp" as const };
}
