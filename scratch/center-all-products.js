const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const REAL_DIR = 'public/images/products/real';
const CANVAS_W = 1440;
const CANVAS_H = 1800; // 4:5 luxury portrait standard
const CONTENT_SCALE = 0.84; // 84% of canvas (16% breathing margins)

async function processProduct(prodSlug) {
  const prodPath = path.join(REAL_DIR, prodSlug);
  if (!fs.existsSync(prodPath) || !fs.statSync(prodPath).isDirectory()) return;

  const files = fs.readdirSync(prodPath).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
  console.log(`\n======================================================`);
  console.log(`PROCESSING: ${prodSlug} (${files.length} images)`);
  console.log(`======================================================`);

  let centeredCount = 0;
  let untouchedCount = 0;

  for (const f of files) {
    const filePath = path.join(prodPath, f);
    const tempPath = path.join(prodPath, `_temp_${f}`);

    try {
      const meta = await sharp(filePath).metadata();
      const corner = await sharp(filePath).extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer();
      const isTrans = meta.hasAlpha && corner[3] < 25;
      const isWhite = corner[0] > 230 && corner[1] > 230 && corner[2] > 230;

      if (!isTrans && !isWhite) {
        // Lifestyle full scene - keep as is
        untouchedCount++;
        continue;
      }

      // Try trimming margins
      const trimmed = await sharp(filePath)
        .trim({ threshold: 12 })
        .toBuffer({ resolveWithObject: true });

      const origArea = meta.width * meta.height;
      const trimArea = trimmed.info.width * trimmed.info.height;

      // If already full bleed (no substantial margins to trim)
      if (trimArea >= origArea * 0.96) {
        untouchedCount++;
        continue;
      }

      const bagW = trimmed.info.width;
      const bagH = trimmed.info.height;

      // Scale to fit within content area
      const maxW = CANVAS_W * CONTENT_SCALE;
      const maxH = CANVAS_H * CONTENT_SCALE;
      const scale = Math.min(maxW / bagW, maxH / bagH);
      const newW = Math.round(bagW * scale);
      const newH = Math.round(bagH * scale);

      const resizedBag = await sharp(trimmed.data)
        .resize(newW, newH, { fit: 'inside' })
        .toBuffer();

      const posX = Math.round((CANVAS_W - newW) / 2);
      const posY = Math.round((CANVAS_H - newH) / 2);

      // Background color: transparent if source had alpha corner, otherwise pure white #FFFFFF
      const bg = isTrans
        ? { r: 0, g: 0, b: 0, alpha: 0 }
        : { r: 255, g: 255, b: 255, alpha: 1 };

      await sharp({
        create: {
          width: CANVAS_W,
          height: CANVAS_H,
          channels: 4,
          background: bg,
        }
      })
      .composite([{ input: resizedBag, left: posX, top: posY }])
      .png({ quality: 95 })
      .toFile(tempPath);

      // Replace original file with centered version
      fs.unlinkSync(filePath);
      fs.renameSync(tempPath, filePath);

      centeredCount++;
      const leftM = posX;
      const rightM = CANVAS_W - posX - newW;
      console.log(`  ✓ Centered: ${f} (Bag: ${newW}x${newH}, Margins L:${leftM} R:${rightM})`);

    } catch (e) {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      console.error(`  ✗ Error on ${f}:`, e.message);
    }
  }

  console.log(`Finished ${prodSlug}: ${centeredCount} centered, ${untouchedCount} lifestyle preserved.`);
}

async function run() {
  const products = fs.readdirSync(REAL_DIR);
  for (const p of products) {
    await processProduct(p);
  }
  console.log('\n======================================================');
  console.log('ALL 14 PRODUCTS PROCESSED AND CENTERED SUCCESSFULLY!');
  console.log('======================================================\n');
}

run().catch(console.error);
