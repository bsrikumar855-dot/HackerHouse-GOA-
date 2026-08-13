import { NextResponse } from "next/server";
import { blobConfigured, newShareId, putShare, type ShareMode } from "@/lib/shareStore";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BYTES = 8 * 1024 * 1024;
const MODES: ShareMode[] = ["pfp", "id", "team"];

export async function POST(req: Request) {

  const form = await req.formData();
  const image = form.get("image");
  const mode = String(form.get("mode") ?? "");
  const caption = String(form.get("caption") ?? "").slice(0, 240);

  if (!(image instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }
  if (image.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image too large" }, { status: 413 });
  }
  if (!MODES.includes(mode as ShareMode)) {
    return NextResponse.json({ error: "Unknown mode" }, { status: 400 });
  }

  const width = Number(form.get("width")) || 1200;
  const height = Number(form.get("height")) || 630;
  const id = newShareId();

  try {
    const record = await putShare(id, await image.arrayBuffer(), {
      id,
      caption,
      mode: mode as ShareMode,
      width,
      height,
      createdAt: Date.now(),
    });
    return NextResponse.json({ id, url: `/r/${id}`, imageUrl: record.imageUrl });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
