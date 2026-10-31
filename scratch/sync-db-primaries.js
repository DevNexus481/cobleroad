const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const primaries = {
  'unfold-laptop-bag': '/images/products/real/unfold-laptop-bag/unfold-laptop-bag-01.png',
  'atlanta-laptop-sleeve': '/images/products/real/atlanta-laptop-sleeve/atlanta-laptop-sleeve-01.png',
  'optimus-transformer-bag': '/images/products/real/optimus-transformer-bag/optimus-transformer-bag-10.png',
  'hipster-fanny-bag': '/images/products/real/hipster-fanny-bag/hipster-fanny-bag-01.png',
  'metropolitan-backpack': '/images/products/real/metropolitan-backpack/metropolitan-backpack-01.png',
  'old-school-rucksack': '/images/products/real/old-school-rucksack/old-school-rucksack-01.png',
  'inappreciable-tote': '/images/products/real/inappreciable-tote/inappreciable-tote-01.png',
  'slugger-backpack': '/images/products/real/slugger-backpack/slugger-backpack-01.png',
  'willowy-backpack': '/images/products/real/willowy-backpack/willowy-backpack-01.png',
  'riviera-backpack': '/images/products/real/riviera-backpack/riviera-backpack-06.png',
  'shoe-compartment-duffle': '/images/products/real/shoe-compartment-duffle/shoe-compartment-duffle-01.png',
  'barrel-gym-bag': '/images/products/real/barrel-gym-bag/barrel-gym-bag-08.png',
  'highway-overnight-bag': '/images/products/real/highway-overnight-bag/highway-overnight-bag-06.png',
  'weekender-duffle': '/images/products/real/weekender-duffle/weekender-duffle-11.png'
};

async function sync() {
  for (const [slug, url] of Object.entries(primaries)) {
    const { data: prod } = await supabase.from('products').select('id, name').eq('slug', slug).single();
    if (!prod) {
      console.log('Product not found:', slug);
      continue;
    }
    
    // Check if image exists in product_images
    const { data: existing } = await supabase.from('product_images').select('id, url, sort_order').eq('product_id', prod.id);
    
    // Shift others up
    for (const img of existing || []) {
      if (img.url === url) {
        await supabase.from('product_images').update({ sort_order: 1 }).eq('id', img.id);
      } else if (img.sort_order === 1) {
        await supabase.from('product_images').update({ sort_order: 2 }).eq('id', img.id);
      }
    }
    
    // If not in existing, insert it
    const hasPrimary = existing?.some(img => img.url === url);
    if (!hasPrimary) {
      await supabase.from('product_images').insert({
        product_id: prod.id,
        url: url,
        alt: prod.name + ' - Studio Centered Front View',
        sort_order: 1
      });
    }
    console.log('Synced primary for ' + slug + ' -> ' + url.split('/').pop());
  }
}

sync();
