import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  // ✅ Ambil logo dari admin
  const adminUser = await User.findOne({ role: "admin" });

  return new Response(JSON.stringify({ logoUrl: adminUser?.logoUrl || "/logo.png" }), { status: 200 });
}
