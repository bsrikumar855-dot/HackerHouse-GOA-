"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Uploader from "./Uploader";
import PhotoStage from "./PhotoStage";
import ShareSheet from "./ShareSheet";
import { fileToImage } from "@/lib/heic";
import { preloadBrandAssets, DATELINE } from "@/lib/assets";
import { builderTitle } from "@/lib/builderTitle";
import {
  IDENTITY,
  SIZES,
  canvasToBlob,
  defaultTransform,
  renderSpec,
  type Person,
  type Spec,
  type Transform,
} from "@/lib/canvasCompose";

type Mode = Spec["mode"];

const MODES: { id: Mode; label: string; blurb: string }[] = [
  { id: "pfp", label: "PFP FRAME", blurb: "Square frame, ready to drop straight into your X avatar." },
  { id: "id", label: "BUILDER ID", blurb: "Event-pass layout with your name, stack and builder class." },
  { id: "team", label: "TEAM FRAME", blurb: "Bring 2–3 teammates into one combined frame." },
];

const emptyPerson = (): Person => ({ image: null, transform: { ...IDENTITY }, name: "" });

export default function FrameStudio() {
  const [mode, setMode] = useState<Mode>("pfp");
  const [people, setPeople] = useState<Person[]>([emptyPerson(), emptyPerson(), emptyPerson()]);
  const [active, setActive] = useState(0);
  const [teamCount, setTeamCount] = useState(2);
  const [teamName, setTeamName] = useState("");
  const [role, setRole] = useState("");
  const [handle, setHandle] = useState("");
  const [reading, setReading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    void preloadBrandAssets();
  }, []);

  const activeIndex = mode === "team" ? active : 0;

  const spec: Spec = useMemo(() => {
    if (mode === "pfp") return { mode, person: people[0] };
    if (mode === "id") return { mode, person: people[0], role, handle };
    return { mode, people: people.slice(0, teamCount), teamName };
  }, [mode, people, role, handle, teamCount, teamName]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      if (!cancelled) void renderSpec(canvas, spec).catch(() => undefined);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [spec]);

  const setPerson = useCallback((index: number, patch: Partial<Person>) => {
    setPeople((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  }, []);

  const handleFile = useCallback(
    async (index: number, file: File) => {
      setReading(index);
      setError(null);
      try {
        const image = await fileToImage(file);
        setPerson(index, { image, transform: defaultTransform(image) });
        if (mode === "team") setActive(index);
      } catch {
        setError("That file could not be read. Try a JPG, PNG or HEIC.");
      } finally {
        setReading(null);
      }
    },
    [mode, setPerson],
  );

  const setTransform = useCallback(
    (t: Transform) => setPerson(activeIndex, { transform: t }),
    [activeIndex, setPerson],
  );

  const resetTransform = useCallback(() => {
    const image = people[activeIndex]?.image;
    setPerson(activeIndex, { transform: image ? defaultTransform(image) : { ...IDENTITY } });
  }, [activeIndex, people, setPerson]);

  const hasPhoto = useMemo(() => {
    if (mode === "team") return people.slice(0, teamCount).some((p) => p.image);
    return Boolean(people[0].image);
  }, [mode, people, teamCount]);

  const getBlob = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("No canvas");
    await renderSpec(canvas, spec);
    return canvasToBlob(canvas);
  }, [spec]);

  const size = SIZES[mode];
  const previewTitle = people[0].name.trim() || "Your Name";

  return (
    <div className="mx-auto w-full max-w-7xl px-2 sm:px-5 pb-20">
      <ModeTabs mode={mode} onChange={setMode} />

      <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="hh-rise">
          <PhotoStage
            canvasRef={canvasRef}
            aspect={size.w / size.h}
            interactive={Boolean(people[activeIndex]?.image)}
            transform={people[activeIndex]?.transform ?? IDENTITY}
            onTransform={setTransform}
            onReset={resetTransform}
          />
          <p className="mt-3 text-center text-xs text-hh-cream/55">
            {people[activeIndex]?.image
              ? "Drag the image to reposition · pinch or use the slider to zoom"
              : "Any photo works — portrait, landscape, off-centre. No cropping needed."}
          </p>
        </section>

        <section className="flex flex-col gap-5">
          {mode !== "team" ? (
            <Uploader
              onFile={(f) => handleFile(0, f)}
              label={people[0].image ? "REPLACE PHOTO" : "UPLOAD PHOTO"}
              hint="JPG · PNG · HEIC from iPhone"
              busy={reading === 0}
              filled={Boolean(people[0].image)}
            />
          ) : (
            <TeamInputs
              people={people}
              count={teamCount}
              active={active}
              reading={reading}
              onCount={setTeamCount}
              onActive={setActive}
              onFile={handleFile}
              onName={(i, name) => setPerson(i, { name })}
            />
          )}

          {error && <p className="text-xs text-hh-pink">{error}</p>}

          {mode === "id" && (
            <IdFields
              name={people[0].name}
              role={role}
              handle={handle}
              onName={(v) => setPerson(0, { name: v })}
              onRole={setRole}
              onHandle={setHandle}
            />
          )}

          {mode === "team" && (
            <Field
              label="TEAM NAME"
              value={teamName}
              onChange={setTeamName}
              placeholder="Team Ragnarok"
              maxLength={28}
            />
          )}

          {mode === "id" && (
            <p className="rounded-xl border border-hh-line bg-hh-green-deep/50 px-4 py-3 text-xs text-hh-cream/70">
              Builder class:{" "}
              <span className="font-bold text-hh-yellow">
                {builderTitle(previewTitle, role || "Builder")}
              </span>
            </p>
          )}

          <ShareSheet getBlob={getBlob} mode={mode} disabled={!hasPhoto} />

          <p className="text-center text-[10px] tracking-[0.18em] text-hh-cream/40">{DATELINE}</p>
        </section>
      </div>
    </div>
  );
}

function ModeTabs({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const current = MODES.find((m) => m.id === mode);
  return (
    <div>
      <div
        role="tablist"
        aria-label="Frame type"
        className="grid grid-cols-3 gap-1 sm:gap-1.5 rounded-2xl border border-hh-line bg-hh-green-deep/60 p-1 sm:p-1.5"
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => onChange(m.id)}
            className={[
              "rounded-xl px-1 sm:px-3 py-3 sm:py-3.5 text-[10px] sm:text-xs font-bold tracking-normal sm:tracking-[0.08em] transition-colors truncate",
              mode === m.id ? "bg-hh-yellow text-hh-green shadow-md" : "text-hh-cream/70 hover:text-hh-cream",
            ].join(" ")}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-hh-cream/60">{current?.blurb}</p>
    </div>
  );
}

function IdFields({
  name,
  role,
  handle,
  onName,
  onRole,
  onHandle,
}: {
  name: string;
  role: string;
  handle: string;
  onName: (v: string) => void;
  onRole: (v: string) => void;
  onHandle: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Field label="NAME" value={name} onChange={onName} placeholder="Shreekumar" maxLength={26} />
      <Field
        label="STACK / ROLE"
        value={role}
        onChange={onRole}
        placeholder="Full-stack · TypeScript"
        maxLength={34}
      />
      <Field label="X HANDLE" value={handle} onChange={onHandle} placeholder="@yourhandle" maxLength={20} />
    </div>
  );
}

function TeamInputs({
  people,
  count,
  active,
  reading,
  onCount,
  onActive,
  onFile,
  onName,
}: {
  people: Person[];
  count: number;
  active: number;
  reading: number | null;
  onCount: (n: number) => void;
  onActive: (i: number) => void;
  onFile: (i: number, f: File) => void;
  onName: (i: number, v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-[10px] tracking-[0.16em] text-hh-cream/55">TEAM SIZE</span>
        {[2, 3].map((n) => (
          <button
            key={n}
            onClick={() => {
              onCount(n);
              if (active >= n) onActive(0);
            }}
            className={[
              "rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
              count === n ? "bg-hh-yellow text-hh-green" : "border border-hh-line text-hh-cream/70",
            ].join(" ")}
          >
            {n}
          </button>
        ))}
      </div>

      {people.slice(0, count).map((p, i) => (
        <div
          key={i}
          onClick={() => p.image && onActive(i)}
          className={[
            "rounded-2xl border p-3 transition-colors",
            active === i && p.image ? "border-hh-yellow/70" : "border-hh-line",
          ].join(" ")}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] tracking-[0.16em] text-hh-cream/55">
              BUILDER {i + 1}
            </span>
            {active === i && p.image && (
              <span className="text-[10px] tracking-[0.14em] text-hh-yellow">ADJUSTING</span>
            )}
          </div>
          <Uploader
            onFile={(f) => onFile(i, f)}
            label={p.image ? "REPLACE" : "UPLOAD PHOTO"}
            compact
            busy={reading === i}
            filled={Boolean(p.image)}
          />
          <input
            value={p.name}
            onChange={(e) => onName(i, e.target.value)}
            placeholder="Name"
            maxLength={18}
            className="mt-2 w-full rounded-lg border border-hh-line bg-hh-green-deep/60 px-3 py-2 text-sm text-hh-cream placeholder:text-hh-cream/35 focus:border-hh-yellow focus:outline-none"
          />
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  maxLength: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] tracking-[0.16em] text-hh-cream/55">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-xl border border-hh-line bg-hh-green-deep/60 px-4 py-3 text-hh-cream placeholder:text-hh-cream/35 focus:border-hh-yellow focus:outline-none"
      />
    </label>
  );
}
