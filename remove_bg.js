import { Jimp } from "jimp";

async function main() {
  const image = await Jimp.read("logo.jpeg");

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];

    // Se o pixel for muito claro (quase branco), torna-o transparente
    if (r > 240 && g > 240 && b > 240) {
      this.bitmap.data[idx + 3] = 0; // Alpha
    }
  });

  await image.write("logo.png");
  console.log("Background removed: saved as logo.png");
}

main().catch(console.error);
