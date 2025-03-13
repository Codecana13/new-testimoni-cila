import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return new Response(JSON.stringify({ message: "Invalid request" }), { status: 400 });
    }

    await connectDB();

    // Find the user with the reset token
    const user = await User.findOne({ resetToken: token });
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid or expired token" }), { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and remove reset token
    user.password = hashedPassword;
    user.resetToken = null; // Clear token so it can't be reused
    await user.save();

    return new Response(JSON.stringify({ message: "Password updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating password:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
