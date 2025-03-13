import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  await connectDB();
  const settings = await Settings.findOne() || { 
    runningText: "Default Running Text", 
    aboutTitle: "About This Website", // ✅ Ensure About Title is Returned
    aboutContent: "Default About Content" 
  };
  return new Response(JSON.stringify(settings), { status: 200 });
}

export async function PUT(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 403 });
  }

  const { runningText, aboutTitle, aboutContent } = await req.json();
  let settings = await Settings.findOne();

  if (!settings) {
    settings = new Settings({ runningText, aboutTitle, aboutContent });
  } else {
    settings.runningText = runningText;
    settings.aboutTitle = aboutTitle; // ✅ Update About Title
    settings.aboutContent = aboutContent;
  }

  await settings.save();
  return new Response(JSON.stringify({ message: "Settings updated successfully" }), { status: 200 });
}
