import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  // ✅ Ambil logo dari user dengan role admin
  const adminUser = await User.findOne({ role: "admin" });

  if (!adminUser) {
    return new Response(JSON.stringify({ logoUrl: "/logo.png" }), { status: 200 });
  }

  console.log("Logo URL dari database:", adminUser.logoUrl); // ✅ Debugging log di VPS

  return new Response(JSON.stringify({ logoUrl: adminUser.logoUrl || "/logo.png" }), { status: 200 });
}
