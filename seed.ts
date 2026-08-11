import "dotenv/config";

import { useDb } from "./shared/lib/db/db.cli";
import { seedRbac } from "./domains/user/data/rbac.seed";



export interface SeededRefs {
  brandId: (slug: string) => number;
  categoryId: (slug: string) => number;
  shopId: (slug: string) => number;
}

export async function runSeed(): Promise<void> {
  const sql = useDb();

  try {
    console.log("🌱  Starting seed…");
    await seedRbac(sql);
    console.log("✅  Seeded RBAC roles and permissions.");

    await sql`DELETE FROM products`;
    await sql`DELETE FROM shops`;
    await sql`DELETE FROM categories`;
    await sql`DELETE FROM brands`;

    await sql`ALTER SEQUENCE brands_id_seq     RESTART WITH 1`;
    await sql`ALTER SEQUENCE categories_id_seq RESTART WITH 1`;
    await sql`ALTER SEQUENCE shops_id_seq      RESTART WITH 1`;
    await sql`ALTER SEQUENCE products_id_seq   RESTART WITH 1`;
    console.log("🗑   Cleared existing data & reset sequences.");

    const brandRows = await sql<{ id: number; slug: string }[]>`
      INSERT INTO brands (name, slug) VALUES
        ('Apple',            'apple'),
        ('Samsung',          'samsung'),
        ('Nike',             'nike'),
        ('Adidas',           'adidas'),
        ('L''Oréal Paris',   'loreal-paris')
      RETURNING id, slug
    `;

    const brandMap = new Map(brandRows.map((r) => [r.slug, r.id]));
    const brandId = (slug: string) => {
      const id = brandMap.get(slug);
      if (!id) throw new Error(`Brand slug not found: ${slug}`);
      return id;
    };

    console.log(`✅  Seeded ${brandRows.length} brands:`, [...brandMap.keys()].join(", "));

    // ── 3. Categories ─────────────────────────────────────────────────────────
    // 3 top-level + 2 sub-categories to demonstrate parent_id
    // Insert top-level first so sub-categories can reference them
    const topCatRows = await sql<{ id: number; slug: string }[]>`
      INSERT INTO categories (parent_id, name, slug) VALUES
        (NULL, 'Electronics', 'electronics'),
        (NULL, 'Fashion',     'fashion'),
        (NULL, 'Beauty',      'beauty')
      RETURNING id, slug
    `;

    const catMap = new Map(topCatRows.map((r) => [r.slug, r.id]));

    // Sub-categories
    const subCatRows = await sql<{ id: number; slug: string }[]>`
      INSERT INTO categories (parent_id, name, slug) VALUES
        (${catMap.get("electronics")!}, 'Phones & Tablets', 'phones-tablets'),
        (${catMap.get("fashion")!},     'Footwear',          'footwear')
      RETURNING id, slug
    `;

    for (const r of subCatRows) catMap.set(r.slug, r.id);

    const categoryId = (slug: string) => {
      const id = catMap.get(slug);
      if (!id) throw new Error(`Category slug not found: ${slug}`);
      return id;
    };

    console.log(`✅  Seeded ${catMap.size} categories:`, [...catMap.keys()].join(", "));

    // ── 4. Shops ──────────────────────────────────────────────────────────────
    // 2 shops with owner_id (treated as a user identifier string)
    const shopRows = await sql<{ id: number; slug: string }[]>`
      INSERT INTO shops (owner_id, name, slug, is_active) VALUES
        ('user-001', 'TechZone Official',  'techzone-official',  TRUE),
        ('user-002', 'StyleHub Store',     'stylehub-store',     TRUE)
      RETURNING id, slug
    `;

    const shopMap = new Map(shopRows.map((r) => [r.slug, r.id]));
    const shopId = (slug: string) => {
      const id = shopMap.get(slug);
      if (!id) throw new Error(`Shop slug not found: ${slug}`);
      return id;
    };

    console.log(`✅  Seeded ${shopRows.length} shops:`, [...shopMap.keys()].join(", "));

    // ── 5. Products ──────────────────────────────────────────────────────────
    const img = (seed: number) => [
      `https://picsum.photos/seed/${seed}/400/400`,
      `https://picsum.photos/seed/${seed + 1}/400/400`,
    ];

    type ProductRow = {
      shop_id: number;
      category_id: number;
      brand_id: number;
      sku: string;
      name: string;
      slug: string;
      description: string;
      price: number;
      image_urls: string[];
      stock: number;
      sales_count: number;
      rating_avg: number;
      rating_count: number;
      attributes: Record<string, string | number | boolean>;
      is_featured: boolean;
    };

    const products: ProductRow[] = [
      // ── Electronics (10) ──────────────────────────────────────────────
      {
        shop_id: shopId("techzone-official"), category_id: categoryId("electronics"), brand_id: brandId("apple"),
        sku: "ELEC-001", name: "MacBook Air M3 15-inch", slug: "macbook-air-m3-15",
        description: "Apple M3 chip, 15.3-inch Liquid Retina display, 18-hour battery, 8-core GPU, fanless design.",
        price: 32990000, image_urls: img(10), stock: 45, sales_count: 3420, rating_avg: 4.90, rating_count: 812,
        attributes: { color: "Midnight", ram: "16GB", storage: "512GB SSD" }, is_featured: true,
      },
      {
        shop_id: shopId("techzone-official"), category_id: categoryId("electronics"), brand_id: brandId("apple"),
        sku: "ELEC-002", name: "iPhone 16 Pro Max 256GB", slug: "iphone-16-pro-max-256",
        description: "A18 Pro chip, 48MP Fusion camera, 5x optical zoom, titanium design, USB-C.",
        price: 34990000, image_urls: img(20), stock: 120, sales_count: 12800, rating_avg: 4.85, rating_count: 3240,
        attributes: { color: "Natural Titanium", storage: "256GB" }, is_featured: true,
      },
      {
        shop_id: shopId("techzone-official"), category_id: categoryId("electronics"), brand_id: brandId("samsung"),
        sku: "ELEC-003", name: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra",
        description: "6.8-inch Dynamic AMOLED, 200MP camera, S Pen, Snapdragon 8 Gen 3, titanium frame.",
        price: 29990000, image_urls: img(30), stock: 95, sales_count: 9870, rating_avg: 4.80, rating_count: 2100,
        attributes: { color: "Titanium Gray", ram: "12GB", storage: "256GB" }, is_featured: true,
      },
      {
        shop_id: shopId("techzone-official"), category_id: categoryId("electronics"), brand_id: brandId("samsung"),
        sku: "ELEC-004", name: "Samsung Galaxy Tab S9 FE", slug: "samsung-galaxy-tab-s9-fe",
        description: "10.9-inch LCD, Exynos 1380, S Pen included, IP68 water resistance, One UI 6.",
        price: 9990000, image_urls: img(40), stock: 200, sales_count: 5640, rating_avg: 4.50, rating_count: 890,
        attributes: { color: "Gray", ram: "6GB", storage: "128GB" }, is_featured: false,
      },
      {
        shop_id: shopId("techzone-official"), category_id: categoryId("electronics"), brand_id: brandId("apple"),
        sku: "ELEC-005", name: "AirPods Pro 2nd Generation", slug: "airpods-pro-2",
        description: "Adaptive Transparency, Personalized Spatial Audio, MagSafe charging, H2 chip.",
        price: 6490000, image_urls: img(50), stock: 300, sales_count: 18200, rating_avg: 4.75, rating_count: 5100,
        attributes: { color: "White", connectivity: "Bluetooth 5.3" }, is_featured: false,
      },
      {
        shop_id: shopId("techzone-official"), category_id: categoryId("electronics"), brand_id: brandId("samsung"),
        sku: "ELEC-006", name: "Samsung 65\" QLED 4K Smart TV", slug: "samsung-65-qled-4k",
        description: "Quantum Dot, Neo Quantum Processor 4K, 120Hz Motion Xcelerator, built-in Alexa.",
        price: 22990000, image_urls: img(60), stock: 30, sales_count: 2100, rating_avg: 4.70, rating_count: 430,
        attributes: { size: "65 inch", resolution: "4K UHD", refresh_rate: "120Hz" }, is_featured: false,
      },
      {
        shop_id: shopId("techzone-official"), category_id: categoryId("electronics"), brand_id: brandId("apple"),
        sku: "ELEC-007", name: "Apple Watch Series 10 GPS", slug: "apple-watch-series-10",
        description: "46mm, always-on Retina LTPO3 display, S10 SiP, water resistant 50m, crash detection.",
        price: 11990000, image_urls: img(70), stock: 150, sales_count: 7300, rating_avg: 4.80, rating_count: 1650,
        attributes: { color: "Jet Black", case_size: "46mm", band: "Sport Loop" }, is_featured: false,
      },
      {
        shop_id: shopId("techzone-official"), category_id: categoryId("electronics"), brand_id: brandId("samsung"),
        sku: "ELEC-008", name: "Samsung Galaxy Buds3 Pro", slug: "samsung-galaxy-buds3-pro",
        description: "Adaptive ANC, 360 Audio, blade lights, 2-way speaker, IP57 rating.",
        price: 5490000, image_urls: img(80), stock: 250, sales_count: 6100, rating_avg: 4.45, rating_count: 1320,
        attributes: { color: "Silver", connectivity: "Bluetooth 5.4" }, is_featured: false,
      },
      {
        shop_id: shopId("techzone-official"), category_id: categoryId("electronics"), brand_id: brandId("apple"),
        sku: "ELEC-009", name: "iPad Air M2 11-inch", slug: "ipad-air-m2-11",
        description: "M2 chip, Liquid Retina display, 12MP front camera, Touch ID, all-day battery.",
        price: 18990000, image_urls: img(90), stock: 80, sales_count: 4500, rating_avg: 4.85, rating_count: 920,
        attributes: { color: "Starlight", ram: "8GB", storage: "256GB" }, is_featured: false,
      },
      {
        shop_id: shopId("techzone-official"), category_id: categoryId("electronics"), brand_id: brandId("samsung"),
        sku: "ELEC-010", name: "Samsung Galaxy Watch7 44mm", slug: "samsung-galaxy-watch7",
        description: "BioActive sensor, Sapphire Crystal glass, 40-hour battery, Wear OS 5.",
        price: 8490000, image_urls: img(100), stock: 140, sales_count: 3800, rating_avg: 4.55, rating_count: 780,
        attributes: { color: "Green", case_size: "44mm" }, is_featured: false,
      },

      // ── Fashion (10) ──────────────────────────────────────────────────
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("fashion"), brand_id: brandId("nike"),
        sku: "FASH-001", name: "Nike Air Force 1 '07", slug: "nike-air-force-1-07",
        description: "Classic basketball icon, premium leather upper, Nike Air cushioning, rubber outsole.",
        price: 2990000, image_urls: img(200), stock: 500, sales_count: 42000, rating_avg: 4.70, rating_count: 9800,
        attributes: { color: "White", size: "42", material: "Leather" }, is_featured: true,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("fashion"), brand_id: brandId("adidas"),
        sku: "FASH-002", name: "Adidas Ultraboost Light", slug: "adidas-ultraboost-light",
        description: "BOOST midsole, Primeknit+ upper, Continental rubber outsole, recycled content.",
        price: 4290000, image_urls: img(210), stock: 220, sales_count: 11500, rating_avg: 4.65, rating_count: 2700,
        attributes: { color: "Core Black", size: "43", material: "Primeknit" }, is_featured: true,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("fashion"), brand_id: brandId("nike"),
        sku: "FASH-003", name: "Nike Dri-FIT Running T-Shirt", slug: "nike-dri-fit-tee",
        description: "Sweat-wicking Dri-FIT technology, lightweight mesh panels, reflective details.",
        price: 890000, image_urls: img(220), stock: 800, sales_count: 28500, rating_avg: 4.50, rating_count: 6100,
        attributes: { color: "Black", size: "L", material: "Polyester" }, is_featured: false,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("fashion"), brand_id: brandId("adidas"),
        sku: "FASH-004", name: "Adidas Essentials Hoodie", slug: "adidas-essentials-hoodie",
        description: "French terry cotton blend, kangaroo pocket, ribbed cuffs, iconic 3-stripes.",
        price: 1490000, image_urls: img(230), stock: 400, sales_count: 19800, rating_avg: 4.55, rating_count: 4300,
        attributes: { color: "Medium Grey Heather", size: "XL", material: "Cotton Blend" }, is_featured: false,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("fashion"), brand_id: brandId("nike"),
        sku: "FASH-005", name: "Nike Air Max 90", slug: "nike-air-max-90",
        description: "Visible Max Air unit, waffle outsole, leather and textile upper, foam midsole.",
        price: 3590000, image_urls: img(240), stock: 300, sales_count: 15600, rating_avg: 4.60, rating_count: 3800,
        attributes: { color: "White/Black/Red", size: "41", material: "Leather/Textile" }, is_featured: false,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("fashion"), brand_id: brandId("adidas"),
        sku: "FASH-006", name: "Adidas Stan Smith Sneakers", slug: "adidas-stan-smith",
        description: "Full-grain leather upper, perforated 3-stripes, rubber cupsole, OrthoLite sockliner.",
        price: 2590000, image_urls: img(250), stock: 350, sales_count: 22300, rating_avg: 4.65, rating_count: 5200,
        attributes: { color: "White/Green", size: "42", material: "Leather" }, is_featured: false,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("fashion"), brand_id: brandId("nike"),
        sku: "FASH-007", name: "Nike Sportswear Club Joggers", slug: "nike-club-joggers",
        description: "Brushed-back fleece, elastic waistband with drawcord, ribbed cuffs, side pockets.",
        price: 1290000, image_urls: img(260), stock: 600, sales_count: 31400, rating_avg: 4.45, rating_count: 7200,
        attributes: { color: "Dark Grey", size: "M", material: "Cotton/Polyester" }, is_featured: false,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("fashion"), brand_id: brandId("adidas"),
        sku: "FASH-008", name: "Adidas Originals Trefoil Tee", slug: "adidas-trefoil-tee",
        description: "100% cotton jersey, ribbed crew neck, large Trefoil logo, relaxed fit.",
        price: 690000, image_urls: img(270), stock: 900, sales_count: 35600, rating_avg: 4.40, rating_count: 8100,
        attributes: { color: "White", size: "M", material: "Cotton" }, is_featured: false,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("fashion"), brand_id: brandId("nike"),
        sku: "FASH-009", name: "Nike Windrunner Jacket", slug: "nike-windrunner-jacket",
        description: "Chevron design, packable hood, mesh lining, zip pockets, water-resistant finish.",
        price: 2290000, image_urls: img(280), stock: 180, sales_count: 8900, rating_avg: 4.60, rating_count: 1900,
        attributes: { color: "Black/White", size: "L", material: "Nylon" }, is_featured: false,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("fashion"), brand_id: brandId("adidas"),
        sku: "FASH-010", name: "Adidas NMD_R1 Sneakers", slug: "adidas-nmd-r1",
        description: "BOOST midsole, Primeknit upper, EVA midsole plugs, rubber outsole.",
        price: 3890000, image_urls: img(290), stock: 200, sales_count: 9200, rating_avg: 4.55, rating_count: 2100,
        attributes: { color: "Core Black/Grey", size: "43", material: "Primeknit" }, is_featured: false,
      },

      // ── Beauty (10) ───────────────────────────────────────────────────
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("beauty"), brand_id: brandId("loreal-paris"),
        sku: "BEAU-001", name: "L'Oréal Revitalift Hyaluronic Acid Serum", slug: "loreal-revitalift-ha-serum",
        description: "1.5% pure Hyaluronic Acid, replumps skin in 1 hour, lightweight gel texture.",
        price: 389000, image_urls: img(400), stock: 600, sales_count: 45200, rating_avg: 4.70, rating_count: 11200,
        attributes: { volume: "30ml", skin_type: "All Skin Types", concern: "Anti-aging" }, is_featured: true,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("beauty"), brand_id: brandId("loreal-paris"),
        sku: "BEAU-002", name: "L'Oréal Paris Rouge Signature Matte", slug: "loreal-rouge-signature-matte",
        description: "Ultra-lightweight matte lip ink, up to 24-hour wear, intense colour payoff.",
        price: 259000, image_urls: img(410), stock: 800, sales_count: 38700, rating_avg: 4.55, rating_count: 8900,
        attributes: { shade: "I Explore", finish: "Matte", type: "Lip Ink" }, is_featured: true,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("beauty"), brand_id: brandId("loreal-paris"),
        sku: "BEAU-003", name: "L'Oréal UV Defender Sunscreen SPF50+", slug: "loreal-uv-defender-spf50",
        description: "Broad-spectrum SPF 50+ PA++++, anti-aging, 12-hour oil control, lightweight fluid.",
        price: 299000, image_urls: img(420), stock: 500, sales_count: 52100, rating_avg: 4.65, rating_count: 13400,
        attributes: { volume: "50ml", spf: "50+", concern: "UV Protection" }, is_featured: false,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("beauty"), brand_id: brandId("loreal-paris"),
        sku: "BEAU-004", name: "L'Oréal Glycolic Bright Serum", slug: "loreal-glycolic-bright-serum",
        description: "1% Glycolic Acid, visibly reduces dark spots, dermatologist-tested, daily use.",
        price: 349000, image_urls: img(430), stock: 400, sales_count: 29800, rating_avg: 4.50, rating_count: 6700,
        attributes: { volume: "30ml", skin_type: "Normal to Oily", concern: "Dark Spots" }, is_featured: false,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("beauty"), brand_id: brandId("loreal-paris"),
        sku: "BEAU-005", name: "L'Oréal Infallible Fresh Wear Foundation", slug: "loreal-infallible-foundation",
        description: "Up to 24-hour wear, breathable formula, medium-to-full buildable coverage.",
        price: 429000, image_urls: img(440), stock: 350, sales_count: 21500, rating_avg: 4.40, rating_count: 4800,
        attributes: { shade: "125 Natural Rose", finish: "Matte", coverage: "Medium-Full" }, is_featured: false,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("beauty"), brand_id: brandId("loreal-paris"),
        sku: "BEAU-006", name: "L'Oréal Extraordinary Oil Shampoo", slug: "loreal-extraordinary-oil-shampoo",
        description: "6 micro-oils blend, nourishes without weighing down, for dry to rough hair.",
        price: 189000, image_urls: img(450), stock: 700, sales_count: 33400, rating_avg: 4.45, rating_count: 7600,
        attributes: { volume: "440ml", hair_type: "Dry/Rough", concern: "Nourishment" }, is_featured: false,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("beauty"), brand_id: brandId("loreal-paris"),
        sku: "BEAU-007", name: "L'Oréal Paris Lash Paradise Mascara", slug: "loreal-lash-paradise-mascara",
        description: "Voluminous fanned-out effect, soft wavy bristle brush, rose oil formula.",
        price: 319000, image_urls: img(460), stock: 450, sales_count: 41200, rating_avg: 4.55, rating_count: 9400,
        attributes: { color: "Blackest Black", type: "Waterproof", effect: "Volume" }, is_featured: false,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("beauty"), brand_id: brandId("loreal-paris"),
        sku: "BEAU-008", name: "L'Oréal True Match Powder", slug: "loreal-true-match-powder",
        description: "Blendable micro-powder, natural finish, SPF 16, matches skin tone precisely.",
        price: 279000, image_urls: img(470), stock: 550, sales_count: 27600, rating_avg: 4.35, rating_count: 5800,
        attributes: { shade: "W2 Light Ivory", finish: "Natural", spf: "16" }, is_featured: false,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("beauty"), brand_id: brandId("loreal-paris"),
        sku: "BEAU-009", name: "L'Oréal Micellar Water 3-in-1", slug: "loreal-micellar-water",
        description: "Cleanses, removes makeup, soothes skin. No rinse, no harsh rubbing needed.",
        price: 199000, image_urls: img(480), stock: 650, sales_count: 58900, rating_avg: 4.60, rating_count: 14200,
        attributes: { volume: "400ml", skin_type: "All Skin Types", concern: "Cleansing" }, is_featured: false,
      },
      {
        shop_id: shopId("stylehub-store"), category_id: categoryId("beauty"), brand_id: brandId("loreal-paris"),
        sku: "BEAU-010", name: "L'Oréal Hyaluron Moisture Cream", slug: "loreal-hyaluron-moisture-cream",
        description: "72-hour hydration, micro Hyaluronic Acid, locks in moisture, non-greasy texture.",
        price: 359000, image_urls: img(490), stock: 380, sales_count: 19400, rating_avg: 4.50, rating_count: 4200,
        attributes: { volume: "50ml", skin_type: "Normal to Dry", concern: "Hydration" }, is_featured: false,
      },
    ];

    // Insert all products
    for (const p of products) {
      await sql`
        INSERT INTO products
          (shop_id, category_id, brand_id, sku, name, slug, description,
           price, image_urls, stock, sales_count, rating_avg, rating_count,
           attributes, is_active, is_featured)
        VALUES
          (${p.shop_id}, ${p.category_id}, ${p.brand_id}, ${p.sku}, ${p.name}, ${p.slug},
           ${p.description}, ${p.price}, ${p.image_urls}, ${p.stock}, ${p.sales_count},
           ${p.rating_avg}, ${p.rating_count}, ${JSON.stringify(p.attributes)},
           TRUE, ${p.is_featured})
      `;
    }

    console.log(`✅  Seeded ${products.length} products.`);
    console.log("\n🎉  Full seed complete — Brands, Categories, Shops & Products.");
  } finally {
    await sql.end();
  }
}

// ── Standalone entry point ───────────────────────────────────────────────────
// Detected when running: bun run lib/seed.ts
const isMain =
  typeof process !== "undefined" &&
  process.argv[1]?.endsWith("seed.ts");

if (isMain) {
  runSeed().catch((err) => {
    console.error("❌  Seed failed:", err);
    process.exit(1);
  });
}
