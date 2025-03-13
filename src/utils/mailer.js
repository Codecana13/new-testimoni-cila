import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(email, resetLink) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Password Request",
      html: `
        <p>Anda meminta reset password.</p>
        <p>Klik link di bawah ini untuk mengatur password baru:</p>
        <a href="${resetLink}" style="background-color:blue; padding:10px 20px; color:white; text-decoration:none; border-radius:5px;">Reset Password</a>
        <p>Jika Anda tidak meminta ini, abaikan email ini.</p>
      `,
    });

    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send password reset email");
  }
}
