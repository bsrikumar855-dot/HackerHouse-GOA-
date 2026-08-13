import sharp from "sharp";

const dir = "public/assets/brand";

async function convert() {
  await sharp(`${dir}/sun-rise.png`)
    .resize(1080)
    .webp({ quality: 82 })
    .toFile(`${dir}/sun-rise.webp`);

  await sharp(`${dir}/footer-trees.png`)
    .resize(1200)
    .webp({ quality: 82 })
    .toFile(`${dir}/footer-trees.webp`);

  console.log("Converted sun-rise.webp and footer-trees.webp");
}

convert().catch(console.error);
