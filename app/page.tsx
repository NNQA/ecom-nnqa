import { getDb } from "@/shared/lib/db/db.server"
import type { Product } from "@/shared/types/ecommerce"
import { ProductCard } from "@/shared/components/ProductCard"
// import { runSeed } from "@/seed";

// ── Valid sort options ──────────────────────────────────────────────────────
// const SORT_OPTIONS = [
//   { value: "sales_desc", label: "Best Selling" },
//   { value: "price_asc", label: "Price: Low → High" },
//   { value: "price_desc", label: "Price: High → Low" },
// ] as const;

// type SortValue = (typeof SORT_OPTIONS)[number]["value"];

// function isValidSort(v: string | undefined): v is SortValue {
//   return SORT_OPTIONS.some((o) => o.value === v);
// }

// // ── Params ──────────────────────────────────────────────────────────────────
// interface SearchParams {
//   q?: string;
//   sort?: string;
//   category?: string;
// }

// // ── Data fetching ───────────────────────────────────────────────────────────
// async function searchProducts(
//   query: string,
//   sort: SortValue,
//   category: string,
// ): Promise<Product[]> {
//   const sql = getDb();
//   const pattern = `%${query}%`;

//   // Build ORDER BY dynamically (safe — values are validated above)
//   let orderClause: string;
//   switch (sort) {
//     case "price_asc":
//       orderClause = "p.price ASC";
//       break;
//     case "price_desc":
//       orderClause = "p.price DESC";
//       break;
//     case "sales_desc":
//     default:
//       orderClause = "p.sales_count DESC";
//       break;
//   }

//   // postgres driver doesn't let us parameterise ORDER BY, so we use
//   // `sql.unsafe` only for the ORDER clause which is validated above.
//   const rows = await sql.unsafe<Product[]>(
//     `SELECT
//        p.id,
//        p.name,
//        p.slug,
//        p.description,
//        p.price::float       AS price,
//        p.stock,
//        p.sales_count,
//        p.rating_avg::float  AS rating_avg,
//        p.rating_count,
//        p.image_urls,
//        p.attributes,
//        p.is_active,
//        p.is_featured,
//        p.category_id,
//        p.brand_id,
//        p.shop_id,
//        c.name  AS category_name,
//        b.name  AS brand_name,
//        s.name  AS shop_name
//      FROM products p
//      LEFT JOIN categories c ON c.id = p.category_id
//      LEFT JOIN brands     b ON b.id = p.brand_id
//      LEFT JOIN shops      s ON s.id = p.shop_id
//      WHERE
//        p.is_active = TRUE
//        AND ($1 = '' OR p.name ILIKE $2)
//        AND ($3 = '' OR c.slug = $3)
//      ORDER BY ${orderClause}
//      LIMIT 100`,
//     [query, pattern, category],
//   );

//   return rows as unknown as Product[];
// }

// async function getCategories() {
//   const sql = getDb();
//   return sql<{ id: number; name: string; slug: string }[]>`
//     SELECT id, name, slug FROM categories WHERE parent_id IS NULL ORDER BY id
//   `;
// }

// // ── Page component ──────────────────────────────────────────────────────────
// export default async function Page({
//   searchParams,
// }: {
//   searchParams: Promise<SearchParams>;
// }) {
//   const params = await searchParams;
//   const query = params.q?.trim() ?? "";
//   const sort: SortValue = isValidSort(params.sort) ? params.sort : "sales_desc";
//   const category = params.category?.trim() ?? "";
//   let products: Product[] = [];
//   let categories: { id: number; name: string; slug: string }[] = [];
//   let dbError = false;

//   try {
//     [products, categories] = await Promise.all([
//       searchProducts(query, sort, category),
//       getCategories(),
//     ]);
//   } catch (err) {
//     console.error("DB error on search page:", err);
//     dbError = true;
//   }

//   function sortHref(s: SortValue) {
//     const p = new URLSearchParams();
//     if (query) p.set("q", query);
//     if (category) p.set("category", category);
//     p.set("sort", s);
//     return `/?${p.toString()}`;
//   }

//   function categoryHref(slug: string) {
//     const p = new URLSearchParams();
//     if (query) p.set("q", query);
//     if (slug) p.set("category", slug);
//     p.set("sort", sort);
//     return `/?${p.toString()}`;
//   }

//   return (
//     <div className="min-h-svh bg-zinc-50 dark:bg-zinc-950">
//       {/* ── Header ────────────────────────────────────────────────────── */}
//       <header className="sticky top-0 z-20 bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center gap-3">
//           <a href="/" className="flex items-center gap-2 shrink-0">
//             <span className="text-white font-extrabold text-2xl tracking-tight drop-shadow-sm">
//               Shoppee
//             </span>
//           </a>

//           <form
//             method="GET"
//             action="/"
//             className="flex flex-1 w-full max-w-2xl gap-2"
//           >
//             {/* Preserve sort & category across searches */}
//             <input type="hidden" name="sort" value={sort} />
//             {category && <input type="hidden" name="category" value={category} />}
//             <input
//               id="search-input"
//               type="text"
//               name="q"
//               defaultValue={query}
//               placeholder="Search products, brands and categories…"
//               autoComplete="off"
//               className="flex-1 rounded-lg px-4 py-2.5 text-sm text-zinc-800 bg-white dark:bg-zinc-900 dark:text-zinc-100 shadow-inner outline-none focus:ring-2 focus:ring-white/60 placeholder:text-zinc-400 transition"
//             />
//             <button
//               type="submit"
//               id="search-button"
//               className="shrink-0 bg-orange-700 hover:bg-orange-800 active:bg-orange-900 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition-colors duration-150 text-sm flex items-center gap-1.5"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
//               </svg>
//               Search
//             </button>
//           </form>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-6">
//         {/* ── Filters bar ─────────────────────────────────────────────── */}
//         <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
//           {/* Category pills */}
//           {categories.length > 0 && (
//             <div className="flex flex-wrap gap-2">
//               <a
//                 href={categoryHref("")}
//                 id="filter-all"
//                 className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${category === ""
//                   ? "bg-orange-500 text-white border-orange-500 shadow-sm"
//                   : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-orange-400"
//                   }`}
//               >
//                 All
//               </a>
//               {categories.map((cat) => (
//                 <a
//                   key={cat.id}
//                   href={categoryHref(cat.slug)}
//                   id={`filter-${cat.slug}`}
//                   className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${category === cat.slug
//                     ? "bg-orange-500 text-white border-orange-500 shadow-sm"
//                     : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-orange-400"
//                     }`}
//                 >
//                   {cat.name}
//                 </a>
//               ))}
//             </div>
//           )}

//           {/* Sort pills */}
//           <div className="flex gap-2 sm:ml-auto">
//             {SORT_OPTIONS.map((opt) => (
//               <a
//                 key={opt.value}
//                 href={sortHref(opt.value)}
//                 id={`sort-${opt.value}`}
//                 className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${sort === opt.value
//                   ? "bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-800 dark:border-zinc-100 shadow-sm"
//                   : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
//                   }`}
//               >
//                 {opt.label}
//               </a>
//             ))}
//           </div>
//         </div>

//         {/* ── Results count ────────────────────────────────────────────── */}
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-sm text-zinc-500 dark:text-zinc-400">
//             {dbError ? (
//               <span className="text-red-500">Failed to load products. Please seed the database first.</span>
//             ) : query ? (
//               <>
//                 Results for{" "}
//                 <span className="text-zinc-800 dark:text-zinc-100 font-semibold">&ldquo;{query}&rdquo;</span>
//                 {" — "}
//                 {products.length} items
//               </>
//             ) : (
//               <>{products.length} products available</>
//             )}
//           </h2>
//         </div>

//         {/* ── Empty: DB not seeded ─────────────────────────────────────── */}
//         {!dbError && products.length === 0 && categories.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
//             <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
//               <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
//               </svg>
//             </div>
//             <p className="text-zinc-600 dark:text-zinc-300 font-medium">Database is empty</p>
//             <p className="text-sm text-zinc-400">
//               Visit{" "}
//               <a href="/api/seed" className="text-orange-500 underline font-medium">
//                 /api/seed
//               </a>{" "}
//               to populate the database, then refresh this page.
//             </p>
//           </div>
//         )}

//         {/* ── Empty: No results ────────────────────────────────────────── */}
//         {!dbError && products.length === 0 && categories.length > 0 && (
//           <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
//             <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
//               <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
//               </svg>
//             </div>
//             <p className="text-zinc-600 dark:text-zinc-300 font-medium">No products found</p>
//             <p className="text-sm text-zinc-400">Try a different search term or browse all categories.</p>
//             <a href="/" className="text-orange-500 text-sm font-medium hover:underline">
//               Clear search
//             </a>
//           </div>
//         )}

//         {/* ── Product grid ─────────────────────────────────────────────── */}
//         {products.length > 0 && (
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
//             {products.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

export default function Page() {
  return <div>asd</div>
}
