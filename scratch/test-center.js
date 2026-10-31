const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function testCenterOneImage(inputPath, outputPath) {
  const meta = await sharp(inputPath).metadata();
  console.log('Original metadata:', meta.width, 'x', meta.height, 'alpha:', meta.hasAlpha);

  // Sample corner to detect background color
  const cornerBuf = await sharp(inputPath).extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer();
  const isTransparent = meta.hasAlpha && cornerBuf[3] < 10;
  const isWhite = cornerBuf[0] > 240 && cornerBuf[1] > 240 && cornerBuf[2] > 240;

  console.log('Corner:', cornerBuf, 'isTransparent:', isTransparent, 'isWhite:', isWhite);

  // Try trimming margins
  const trimmed = await sharp(inputPath)
    .trim({ threshold: 12 })
    .toBuffer({ resolveWithObject: true });

  console.log('Trimmed size:', trimmed.info.width, 'x', trimmed.info.height);
  console.log('Trim offsets:', trimmed.info.trimOffsetLeft, trimmed.info.trimOffsetTop);

  const bagW = trimmed.info.width;
  const bagH = trimmed.info.height;

  // Let's create a target 4:5 canvas (e.g. 1600x2000) or 1:1 canvas
  // In 4:5 portrait: max width is 1600, max height is 2000
  // Target bag scale so it occupies ~84% of canvas
  const targetW = 1600;
  const targetH = 2000;
  const maxContentW = targetW * 0.85; // 1360
  const maxContentH = targetH * 0.85; // 1700

  const scale = Math.min(maxContentW / bagW, maxContentH / bagH, 1.2);
  const newBagW = Math.round(bagW * scale);
  const newBagH = Math.round(bagH * scale);

  const resizedBag = await sharp(trimmed.data)
    .resize(newBagW, newBagH, { fit: 'inside' })
    .toBuffer();

  const posX = Math.round((targetW - newBagW) / 2);
  const posY = Math.round((targetH - newBagH) / 2);

  // Background: if transparent, transparent. If white, white or transparent.
  const bg = isTransparent ? { r: 0, g: 0, b: 0, alpha: 0 } : { r: 255, g: 255, b: 255, alpha: 1 };

  await sharp({
    create: {
      width: targetW,
      height: targetH,
      channels: 4,
      background: bg,
    }
  })
  .composite([{ input: resizedBag, left: posX, top: posY }])
  .png()
  .toFile(outputPath);

  console.log(`Saved centered image to ${outputPath}`);
  console.log(`Bag is now ${newBagW}x${newBagH} centered at left=${posX}, top=${posY} on ${targetW}x${targetH} canvas.`);
  console.log(`Left margin: ${posX}, Right margin: ${targetW - posX - newBagW} (Diff: ${Math.abs(posX - (targetW - posX - newBagW))})`);
}

testCenterOneImage(
  'public/images/products/real/shoe-compartment-duffle/shoe-compartment-duffle-01.png',
  'scratch/test-centered-shoe-duffle.png'
).catch(console.error);
