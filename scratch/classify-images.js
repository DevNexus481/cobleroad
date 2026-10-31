const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function classifyAllImages() {
  const dir = 'public/images/products/real';
  const products = fs.readdirSync(dir);
  
  let studioCount = 0;
  let lifestyleCount = 0;
  const productSummary = {};

  for (const prod of products) {
    const prodPath = path.join(dir, prod);
    if (!fs.statSync(prodPath).isDirectory()) continue;
    const files = fs.readdirSync(prodPath).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
    
    productSummary[prod] = { studio: [], lifestyle: [] };

    for (const f of files) {
      const fullPath = path.join(prodPath, f);
      try {
        const meta = await sharp(fullPath).metadata();
        const cornerBuf = await sharp(fullPath).extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer();
        const isTransparent = meta.hasAlpha && cornerBuf[3] < 20;
        const isWhite = cornerBuf[0] > 235 && cornerBuf[1] > 235 && cornerBuf[2] > 235;

        // Try trim
        let isStudio = false;
        if (isTransparent || isWhite) {
          try {
            const t = await sharp(fullPath).trim({ threshold: 12 }).toBuffer({ resolveWithObject: true });
            // If trimmed area is less than 96% of total area
            const origArea = meta.width * meta.height;
            const trimArea = t.info.width * t.info.height;
            if (trimArea < origArea * 0.96) {
              isStudio = true;
            }
          } catch (e) {
            isStudio = false;
          }
        }

        if (isStudio) {
          studioCount++;
          productSummary[prod].studio.push(f);
        } else {
          lifestyleCount++;
          productSummary[prod].lifestyle.push(f);
        }
      } catch (e) {
        console.error('Error on', f, e.message);
      }
    }
  }

  console.log(`TOTALS: Studio (isolated bags): ${studioCount}, Lifestyle / Scene: ${lifestyleCount}`);
  for (const [p, data] of Object.entries(productSummary)) {
    console.log(`\n${p}: ${data.studio.length} studio, ${data.lifestyle.length} lifestyle`);
    if (data.studio.length > 0) console.log(`   Studio sample: ${data.studio.slice(0, 3).join(', ')}`);
    if (data.lifestyle.length > 0) console.log(`   Lifestyle sample: ${data.lifestyle.slice(0, 3).join(', ')}`);
  }
}

classifyAllImages().catch(console.error);
