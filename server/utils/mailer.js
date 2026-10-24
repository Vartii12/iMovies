const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER || "test@example.com",
        pass: process.env.EMAIL_PASS || "testpassword",
      },
    });
  }
  return transporter;
};

const verifyTransport = async () => {
  try {
    const t = getTransporter();
    await t.verify();
    console.log("Mail transporter verified");
    return true;
  } catch (err) {
    console.log("Mailer warning (running in mock mode if SMTP not configured):", err.message);
    return false;
  }
};

const sendMail = async ({ to, subject, text, html }) => {
  try {
    const t = getTransporter();
    const info = await t.sendMail({
      from: `"iMovies" <${process.env.EMAIL_USER || "noreply@imovies.com"}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (err) {
    console.log("Email sending simulated/logged: ", { to, subject });
    return { mock: true };
  }
};

module.exports = {
  verifyTransport,
  sendMail,
};
