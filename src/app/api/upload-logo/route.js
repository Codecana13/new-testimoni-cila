import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// 🔹 Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const data = await req.formData();
  const file = data.get("file");

  if (!file) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  try {
    // ✅ Upload ke Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResponse = await cloudinary.uploader.upload(`data:image/png;base64,${buffer.toString("base64")}`, {
      folder: "website-logo",
      public_id: "navbar_logo",
      overwrite: true, // Ganti logo lama
    });

    // ✅ Simpan URL logo di database
    await User.updateOne({ role: "admin" }, { logoUrl: uploadResponse.secure_url });

    return NextResponse.json({ message: "Logo updated successfully", logoUrl: uploadResponse.secure_url }, { status: 200 });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
