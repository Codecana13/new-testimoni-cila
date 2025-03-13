import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(email, resetToken) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or use SMTP settings
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email app password
      },
    });

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/new?token=${resetToken}`;

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to set a new password:</p>
        <a href="${resetLink}" style="background-color:blue; padding:10px 20px; color:white; text-decoration:none; border-radius:5px;">Reset Password</a>
        <p>If you didn’t request this, please ignore this email.</p>
      `,
    });

    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send password reset email");
  }
}
