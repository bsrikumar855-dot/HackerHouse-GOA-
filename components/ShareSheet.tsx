"use client";

import { useCallback, useState } from "react";
import { CAPTIONS, isIos, saveOrShare, tweetIntent } from "@/lib/share";
import type { Spec } from "@/lib/canvasCompose";

type Props = {
  getBlob: () => Promise<Blob>;
  mode: Spec["mode"];
  disabled: boolean;
};

const FILENAME = {
  pfp: "hhgoa-2026-pfp.png",
  id: "hhgoa-2026-builder-id.png",
  id_vert: "hhgoa-2026-builder-id-vertical.png",
  team: "hhgoa-2026-team.png",
} as const;

export default function ShareSheet({ getBlob, mode, disabled }: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState<"save" | "share" | null>(null);
  const [longPress, setLongPress] = useState<string | null>(null);

  const save = useCallback(async () => {
    setBusy("save");
    setStatus(null);
    setLongPress(null);
    try {
      const blob = await getBlob();
      const outcome = await saveOrShare(blob, FILENAME[mode]);
      if (outcome === "downloaded" && isIos()) {
        // Last-resort iOS path: render the PNG so it can be long-pressed and saved.
        setLongPress(URL.createObjectURL(blob));
        setStatus("Long-press the image below → Save to Photos");
      } else if (outcome === "downloaded") {
        setStatus("Saved to your downloads.");
      }
    } catch {
      setStatus("Could not export the image. Try again.");
    } finally {
      setBusy(null);
    }
  }, [getBlob, mode]);

  const share = useCallback(async () => {
    const caption = CAPTIONS[mode];
    // Safari blocks window.open once the click's task has yielded, so the tab is
    // claimed synchronously and its URL is filled in after the upload resolves.
    const tab = window.open("", "_blank", "noopener");

    setBusy("share");
    setStatus(null);
    setLongPress(null);

    try {
      const blob = await getBlob();
      const form = new FormData();
      form.append("image", new File([blob], FILENAME[mode], { type: "image/png" }));
      form.append("mode", mode);
      form.append("caption", caption);

      const res = await fetch("/api/upload", { method: "POST", body: form });

      let intent: string;
      if (res.ok) {
        const { url } = (await res.json()) as { url: string };
        intent = tweetIntent(caption, new URL(url, window.location.origin).toString());
      } else {
        intent = tweetIntent(caption);
        setStatus("Link preview unavailable — download the image and attach it to your post.");
      }

      if (tab) tab.location.replace(intent);
      else window.location.href = intent;
    } catch {
      if (tab) tab.close();
      setStatus("Could not open X. Try downloading the image instead.");
    } finally {
      setBusy(null);
    }
  }, [getBlob, mode]);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={save}
          disabled={disabled || busy !== null}
          className="rounded-xl border-2 border-hh-yellow px-4 py-4 text-sm font-bold tracking-[0.1em] text-hh-yellow transition-transform active:scale-95 disabled:opacity-40"
        >
          {busy === "save" ? "SAVING…" : "DOWNLOAD"}
        </button>
        <button
          type="button"
          onClick={share}
          disabled={disabled || busy !== null}
          className="rounded-xl bg-hh-yellow px-4 py-4 text-sm font-bold tracking-[0.1em] text-hh-green transition-transform active:scale-95 disabled:opacity-40"
        >
          {busy === "share" ? "OPENING…" : "SHARE TO X"}
        </button>
      </div>

      {status && <p className="text-center text-xs text-hh-cream/75">{status}</p>}

      {longPress && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={longPress}
          alt="Your frame — long-press to save"
          className="w-full rounded-xl border-2 border-hh-yellow/60"
        />
      )}
    </div>
  );
}
