const PREFIXES = [
  "Shipwright",
  "Signal",
  "Terminal",
  "Protocol",
  "Rogue",
  "Midnight",
  "Monsoon",
  "Lowlatency",
  "Saltwater",
  "Deepwork",
  "Firstprincipal",
  "Offgrid",
];

const SUFFIXES = [
  "Architect",
  "Operator",
  "Native",
  "Runner",
  "Forge",
  "Prototyper",
  "Renegade",
  "Mechanic",
  "Cartographer",
  "Wrangler",
];

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Stable for a given name+role so re-renders never reshuffle the title. */
export function builderTitle(name: string, role: string): string {
  const seed = hash(`${name.trim().toLowerCase()}::${role.trim().toLowerCase()}`);
  const prefix = PREFIXES[seed % PREFIXES.length];
  const suffix = SUFFIXES[Math.floor(seed / PREFIXES.length) % SUFFIXES.length];
  return `${prefix} ${suffix}`;
}

/** Deterministic 3-digit pass number shown on the ID card. */
export function builderNumber(name: string, role: string): string {
  const seed = hash(`no::${name.trim().toLowerCase()}::${role.trim().toLowerCase()}`);
  return String((seed % 247) + 1).padStart(3, "0");
}
