const HEIC_EXT = /\.(heic|heif)$/i;

export function isHeic(file: File): boolean {
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    // iOS Safari often reports an empty MIME type for HEIC picks
    ((file.type === "" || file.type === "application/octet-stream") && HEIC_EXT.test(file.name))
  );
}

async function convertOnServer(file: File): Promise<Blob> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/convert", { method: "POST", body });
  if (!res.ok) throw new Error("Server HEIC conversion failed");
  return res.blob();
}

/**
 * Returns a browser-decodable image blob. HEIC is decoded in the browser when
 * possible and handed to a sharp-backed route when the WASM decoder chokes.
 */
export async function toDecodableImage(file: File): Promise<Blob> {
  if (!isHeic(file)) return file;

  try {
    const heic2any = (await import("heic2any")).default;
    const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
    return Array.isArray(out) ? out[0] : (out as Blob);
  } catch {
    return convertOnServer(file);
  }
}

export async function fileToImage(file: File): Promise<HTMLImageElement> {
  const blob = await toDecodableImage(file);
  const url = URL.createObjectURL(blob);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not read that image"));
      img.src = url;
    });
  } finally {
    // The decoded pixels are retained by the HTMLImageElement itself.
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
}
