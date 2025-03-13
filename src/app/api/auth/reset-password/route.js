import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/utils/mailer"; // ✅ Import the function

export async function POST(req) {
  const { email } = await req.json();
  if (!email) return new Response(JSON.stringify({ message: "Email required" }), { status: 400 });

  await connectDB();

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
  }

  // Generate and store reset token
  const resetToken = Math.random().toString(36).substr(2);
  user.resetToken = resetToken;
  await user.save();

  // Send password reset email
  await sendPasswordResetEmail(email, resetToken);

  return new Response(JSON.stringify({ message: "Reset link sent" }), { status: 200 });
}
