import { execSync } from "child_process";
import fs from "fs";

try {
  console.log("Auditing http://localhost:3000 ...");
  const out = execSync("npx -y lighthouse http://localhost:3000 --output=json --quiet --chrome-flags=\"--headless\"", { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 });
  const data = JSON.parse(out);
  const scores = Object.fromEntries(
    Object.entries(data.categories).map(([k, v]) => [v.title, Math.round(v.score * 100)])
  );
  console.log("HOMEPAGE SCORES:", scores);
  fs.writeFileSync("public/lighthouse-home.json", JSON.stringify(scores, null, 2));
} catch (err) {
  console.error("Audit error:", err.message);
}

try {
  console.log("Auditing http://localhost:3000/generate ...");
  const out = execSync("npx -y lighthouse http://localhost:3000/generate --output=json --quiet --chrome-flags=\"--headless\"", { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 });
  const data = JSON.parse(out);
  const scores = Object.fromEntries(
    Object.entries(data.categories).map(([k, v]) => [v.title, Math.round(v.score * 100)])
  );
  console.log("GENERATE SCORES:", scores);
  fs.writeFileSync("public/lighthouse-generate.json", JSON.stringify(scores, null, 2));
} catch (err) {
  console.error("Audit error:", err.message);
}
