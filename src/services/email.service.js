import resend from "../config/resend.config.js";

const sendEmail = async (email, subject, html) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: subject,
    html: html,
  });

  if (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send email");
  }

  console.log("Email sent successfully:", data);
  return data;
};

export default sendEmail;
