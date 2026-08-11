import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getShare } from "@/lib/shareStore";
import { DATELINE } from "@/lib/assets";

type Props = { params: Promise<{ id: string }> };

const TITLES = {
  pfp: "HH Goa 2026 — PFP Frame",
  id: "HH Goa 2026 — Builder ID",
  team: "HH Goa 2026 — Team Frame",
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const record = await getShare(id);
  if (!record) return { title: "Frame not found — HH Goa 2026" };

  const title = TITLES[record.mode];
  const description = record.caption || "Made with the HH Goa 2026 frame generator. #FrameInGoa";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: record.imageUrl,
          width: record.width,
          height: record.height,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [record.imageUrl],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const record = await getShare(id);
  if (!record) notFound();

  return (
    <main className="hh-grain flex min-h-dvh flex-col items-center justify-center gap-8 px-5 py-14">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-hh-yellow bg-hh-green-deep">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={record.imageUrl}
          alt={TITLES[record.mode]}
          width={record.width}
          height={record.height}
          className="h-auto w-full"
        />
      </div>

      <div className="text-center">
        <p className="hh-display text-4xl text-hh-yellow sm:text-5xl">{TITLES[record.mode]}</p>
        <p className="mt-2 text-xs tracking-[0.22em] text-hh-cream/70">{DATELINE}</p>
      </div>

      <Link
        href="/"
        className="rounded-full bg-hh-yellow px-8 py-4 text-sm font-bold tracking-[0.14em] text-hh-green transition-transform active:scale-95"
      >
        MAKE YOUR OWN →
      </Link>
    </main>
  );
}
