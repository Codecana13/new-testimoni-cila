import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  await connectDB();
  const users = await User.find({ role: "editor" }).select("-password");
  return new Response(JSON.stringify(users), { status: 200 });
}

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 403 });
  }

  const { name, email, password } = await req.json();

  // Cek apakah user sudah ada
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: "Email already registered" }), { status: 400 });
  }

  // Hash password sebelum menyimpan
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ name, email, password: hashedPassword, role: "editor" });
  await newUser.save();

  return new Response(JSON.stringify({ message: "Editor added successfully", userId: newUser._id }), { status: 201 });
}

export async function DELETE(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 403 });
  }

  const { userId } = await req.json();

  const user = await User.findById(userId);
  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
  }

  if (user.role !== "editor") {
    return new Response(JSON.stringify({ message: "Only editors can be deleted" }), { status: 403 });
  }

  await User.deleteOne({ _id: userId });

  return new Response(JSON.stringify({ message: "Editor deleted successfully" }), { status: 200 });
}
