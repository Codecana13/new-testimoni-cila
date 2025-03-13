import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/utils/mailer";

export async function POST(req) {
  const { email } = await req.json();
  if (!email) {
    return new Response(JSON.stringify({ message: "Email required" }), { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
  }

  // ✅ Gunakan domain dari env
  const appUrl = process.env.PUBLIC_APP_URL || "http://localhost:3000";
  const resetToken = Math.random().toString(36).substr(2);
  user.resetToken = resetToken;
  await user.save();

  const resetLink = `${appUrl}/reset-password/new?token=${resetToken}`;
  
  // ✅ Kirim email dengan reset link
  await sendPasswordResetEmail(email, resetLink);

  return new Response(JSON.stringify({ message: "Reset link sent to your email" }), { status: 200 });
}
