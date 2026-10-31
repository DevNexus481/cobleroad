const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function checkAllProducts() {
  const dir = 'public/images/products/real';
  const products = fs.readdirSync(dir);
  
  for (const prod of products) {
    const prodPath = path.join(dir, prod);
    if (!fs.statSync(prodPath).isDirectory()) continue;
    const files = fs.readdirSync(prodPath).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
    
    console.log(`\n========================================`);
    console.log(`PRODUCT: ${prod} (Total images: ${files.length})`);
    console.log(`========================================`);
    
    for (const f of files) {
      const fullPath = path.join(prodPath, f);
      try {
        const meta = await sharp(fullPath).metadata();
        let trimMsg = 'No trim';
        try {
          const t = await sharp(fullPath).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
          const leftP = Math.abs(t.info.trimOffsetLeft);
          const topP = Math.abs(t.info.trimOffsetTop);
          const rightP = meta.width - leftP - t.info.width;
          const bottomP = meta.height - topP - t.info.height;
          trimMsg = `Bag: ${t.info.width}x${t.info.height} | Margins -> L:${leftP} R:${rightP} T:${topP} B:${bottomP}`;
        } catch (te) {
          trimMsg = 'Trim: full-bleed';
        }
        console.log(`  ${f}: [${meta.width}x${meta.height}] ${trimMsg}`);
      } catch (e) {
        console.log(`  ${f}: Error ${e.message}`);
      }
    }
  }
}

checkAllProducts().catch(console.error);
