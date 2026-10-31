const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function inspectBackgrounds() {
  const dir = 'public/images/products/real';
  const products = fs.readdirSync(dir);
  
  for (const prod of products) {
    const prodPath = path.join(dir, prod);
    if (!fs.statSync(prodPath).isDirectory()) continue;
    const files = fs.readdirSync(prodPath).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
    if (!files.length) continue;
    
    // Check first 2 files
    for (const f of files.slice(0, 2)) {
      const fullPath = path.join(prodPath, f);
      const img = sharp(fullPath);
      const meta = await img.metadata();
      
      // Sample 1x1 at top-left corner
      const corner = await sharp(fullPath).extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer();
      const cornerArr = Array.from(corner);
      
      console.log(`${prod}/${f} (${meta.width}x${meta.height}, alpha:${meta.hasAlpha}) -> corner: [${cornerArr.join(', ')}]`);
    }
  }
}

inspectBackgrounds().catch(console.error);
