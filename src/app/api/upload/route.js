import { uploadImage } from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64Image}`;

    const imageUrl = await uploadImage(dataUri);

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 });
    }

    return new Response(JSON.stringify({ url: imageUrl }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
