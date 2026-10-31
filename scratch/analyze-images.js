const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function analyze() {
  const samples = [
    'public/images/products/real/unfold-laptop-bag/unfold-laptop-bag-01.png',
    'public/images/products/real/barrel-gym-bag/barrel-gym-bag-01.png',
    'public/images/products/real/barrel-gym-bag/barrel-gym-bag-08.png',
    'public/images/products/real/metropolitan-backpack/metropolitan-backpack-01.png',
    'public/images/products/real/inappreciable-tote/inappreciable-tote-05.png',
    'public/images/products/real/weekender-duffle/weekender-duffle-11.png',
    'public/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-03.png',
    'public/images/products/real/optimus-transformer-bag/optimus-transformer-bag-13.png',
    'public/images/products/real/old-school-rucksack/old-school-rucksack-01.png',
    'public/images/products/real/shoe-compartment-duffle/shoe-compartment-duffle-01.png',
    'public/images/products/real/slugger-backpack/slugger-backpack-01.png',
    'public/images/products/real/willowy-backpack/willowy-backpack-02.png',
    'public/images/products/real/highway-overnight-bag/highway-overnight-bag-06.png',
    'public/images/products/real/riviera-backpack/riviera-backpack-06.png',
  ];

  for (const s of samples) {
    if (!fs.existsSync(s)) continue;
    const img = sharp(s);
    const meta = await img.metadata();
    
    // Check trim bounding box
    let trimInfo = 'N/A';
    try {
      const trimmed = await sharp(s).trim().toBuffer({ resolveWithObject: true });
      trimInfo = `Trimmed: ${trimmed.info.width}x${trimmed.info.height}, offset: top=${trimmed.info.trimOffsetTop}, left=${trimmed.info.trimOffsetLeft}`;
    } catch (e) {
      trimInfo = 'Trim error: ' + e.message;
    }

    console.log(`\n=== ${path.basename(path.dirname(s))} / ${path.basename(s)} ===`);
    console.log(`Original: ${meta.width}x${meta.height}, format: ${meta.format}, channels: ${meta.channels}, hasAlpha: ${meta.hasAlpha}`);
    console.log(trimInfo);
  }
}

analyze().catch(console.error);
