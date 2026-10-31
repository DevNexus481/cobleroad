const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function testCenterProduct(productSlug) {
  const prodDir = path.join('public/images/products/real', productSlug);
  const files = fs.readdirSync(prodDir).filter(f => f.endsWith('.png'));

  console.log(`Testing centering for ${productSlug} (${files.length} images)...`);

  for (const f of files.slice(0, 3)) {
    const filePath = path.join(prodDir, f);
    const meta = await sharp(filePath).metadata();
    
    // Sample corner
    const corner = await sharp(filePath).extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer();
    const isTrans = meta.hasAlpha && corner[3] < 20;
    const isWhite = corner[0] > 235 && corner[1] > 235 && corner[2] > 235;

    if (!isTrans && !isWhite) {
      console.log(`Skipping lifestyle shot: ${f}`);
      continue;
    }

    try {
      const trimmed = await sharp(filePath).trim({ threshold: 12 }).toBuffer({ resolveWithObject: true });
      const origArea = meta.width * meta.height;
      const trimArea = trimmed.info.width * trimmed.info.height;

      if (trimArea >= origArea * 0.98) {
        console.log(`Skipping full-bleed image: ${f}`);
        continue;
      }

      const bagW = trimmed.info.width;
      const bagH = trimmed.info.height;

      // Clean standard portrait 4:5 canvas (1440 x 1800)
      const canvasW = 1440;
      const canvasH = 1800;
      const maxW = canvasW * 0.84;
      const maxH = canvasH * 0.84;

      const scale = Math.min(maxW / bagW, maxH / bagH);
      const newW = Math.round(bagW * scale);
      const newH = Math.round(bagH * scale);

      const resizedBag = await sharp(trimmed.data)
        .resize(newW, newH, { fit: 'inside' })
        .toBuffer();

      const posX = Math.round((canvasW - newW) / 2);
      const posY = Math.round((canvasH - newH) / 2);

      const bg = isTrans
        ? { r: 0, g: 0, b: 0, alpha: 0 }
        : { r: 255, g: 255, b: 255, alpha: 1 };

      const outBuf = await sharp({
        create: {
          width: canvasW,
          height: canvasH,
          channels: 4,
          background: bg,
        }
      })
      .composite([{ input: resizedBag, left: posX, top: posY }])
      .png({ quality: 95 })
      .toBuffer();

      // Check resulting margins
      const verify = await sharp(outBuf).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
      const vLeft = Math.abs(verify.info.trimOffsetLeft);
      const vRight = canvasW - vLeft - verify.info.width;
      console.log(`${f}: Orig [${meta.width}x${meta.height}] -> Centered [${canvasW}x${canvasH}], Bag [${newW}x${newH}], L:${vLeft} R:${vRight} (Diff: ${Math.abs(vLeft - vRight)})`);

    } catch (e) {
      console.error(`Error on ${f}:`, e.message);
    }
  }
}

testCenterProduct('barrel-gym-bag').catch(console.error);
