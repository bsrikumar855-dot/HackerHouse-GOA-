import sharp from "sharp";

const dir = "public/assets/brand";

await sharp(`${dir}/sun-rise.png`)
  .resize(720)
  .png({ compressionLevel: 9 })
  .toFile(`${dir}/sun-rise-720.png`);

await sharp(`${dir}/footer-trees.png`)
  .resize(900)
  .png({ compressionLevel: 9 })
  .toFile(`${dir}/footer-trees-900.png`);

for (const f of ["sun-rise-720.png", "footer-trees-900.png"]) {
  const m = await sharp(`${dir}/${f}`).metadata();
  console.log(f, `${m.width}x${m.height}`, m.hasAlpha ? "alpha" : "opaque");
}
