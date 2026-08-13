import { list, put } from "@vercel/blob";
import fs from "fs";
import path from "path";

export type ShareMode = "pfp" | "id" | "id_vert" | "team";

export type ShareRecord = {
  id: string;
  imageUrl: string;
  caption: string;
  mode: ShareMode;
  width: number;
  height: number;
  createdAt: number;
};

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function newShareId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

const localStore = new Map<string, ShareRecord>();

export async function putShare(
  id: string,
  image: ArrayBuffer,
  meta: Omit<ShareRecord, "imageUrl">,
): Promise<ShareRecord> {
  if (blobConfigured()) {
    const blob = await put(`frames/${id}.png`, image, {
      access: "public",
      contentType: "image/png",
      addRandomSuffix: false,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });

    const record: ShareRecord = { ...meta, imageUrl: blob.url };

    await put(`frames/${id}.json`, JSON.stringify(record), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      cacheControlMaxAge: 60,
    });

    return record;
  }

  // Local fallback: write to public/uploads/
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, `${id}.png`);
  fs.writeFileSync(filePath, Buffer.from(image));

  const imageUrl = `/uploads/${id}.png`;
  const record: ShareRecord = { ...meta, imageUrl };
  localStore.set(id, record);
  return record;
}

export async function getShare(id: string): Promise<ShareRecord | null> {
  if (!/^[a-z0-9]{6,32}$/i.test(id)) return null;

  if (blobConfigured()) {
    try {
      const { blobs } = await list({ prefix: `frames/${id}.json`, limit: 1 });
      const meta = blobs.find((b) => b.pathname === `frames/${id}.json`);
      if (!meta) return null;

      const res = await fetch(meta.url, { cache: "no-store" });
      if (!res.ok) return null;
      return (await res.json()) as ShareRecord;
    } catch {
      return null;
    }
  }

  // Local fallback
  const record = localStore.get(id);
  if (record) return record;

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadsDir, `${id}.png`);
  if (fs.existsSync(filePath)) {
    return {
      id,
      imageUrl: `/uploads/${id}.png`,
      caption: "HH Goa 2026 Badge",
      mode: "id",
      width: 1200,
      height: 630,
      createdAt: Date.now(),
    };
  }

  return null;
}
