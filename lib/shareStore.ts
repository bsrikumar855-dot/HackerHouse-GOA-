import { list, put } from "@vercel/blob";

export type ShareMode = "pfp" | "id" | "team";

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

const imagePath = (id: string) => `frames/${id}.png`;
const metaPath = (id: string) => `frames/${id}.json`;

export async function putShare(
  id: string,
  image: ArrayBuffer,
  meta: Omit<ShareRecord, "imageUrl">,
): Promise<ShareRecord> {
  const blob = await put(imagePath(id), image, {
    access: "public",
    contentType: "image/png",
    addRandomSuffix: false,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
  });

  const record: ShareRecord = { ...meta, imageUrl: blob.url };

  await put(metaPath(id), JSON.stringify(record), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
  });

  return record;
}

/**
 * Metadata lives beside the image in Blob rather than in a separate KV store,
 * so a share link needs only BLOB_READ_WRITE_TOKEN to resolve.
 */
export async function getShare(id: string): Promise<ShareRecord | null> {
  if (!blobConfigured()) return null;
  if (!/^[a-z0-9]{6,32}$/i.test(id)) return null;

  try {
    const { blobs } = await list({ prefix: metaPath(id), limit: 1 });
    const meta = blobs.find((b) => b.pathname === metaPath(id));
    if (!meta) return null;

    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as ShareRecord;
  } catch {
    return null;
  }
}
