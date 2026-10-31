async function test() {
  try {
    const res = await fetch('http://localhost:3000/shop');
    console.log('HTTP Status:', res.status);
    const html = await res.text();
    const realImages = html.match(/\/images\/products\/real\/[a-z0-9\/-]+\.(png|jpg)/g) || [];
    console.log('Real image matches count:', realImages.length);
    console.log('Sample real image URLs found in page:');
    [...new Set(realImages)].slice(0, 10).forEach(img => console.log(' - ' + img));

    const oldImages = html.match(/\/images\/products\/[a-z0-9-]+\.(png|jpg)/g) || [];
    const filteredOld = oldImages.filter(img => !img.includes('/real/'));
    console.log('Old images count on page:', filteredOld.length);
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}
test();
