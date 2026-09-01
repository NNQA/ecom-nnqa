import type { Product } from "@/shared/types/ecommerce"

interface ProductCardProps {
  product: Product
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const partial = rating - full
  const empty = 5 - Math.ceil(rating)

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`Rating: ${rating} out of 5`}
    >
      {Array.from({ length: full }).map((_, i) => (
        <svg
          key={`f${i}`}
          className="h-3 w-3 fill-current text-yellow-400"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {partial > 0 && (
        <svg key="p" className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id={`grad-${rating}`}>
              <stop offset={`${partial * 100}%`} stopColor="currentColor" />
              <stop offset={`${partial * 100}%`} stopColor="#d1d5db" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#grad-${rating})`}
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg
          key={`e${i}`}
          className="h-3 w-3 fill-current text-gray-300"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price)
}

function formatSales(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
  return count.toString()
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl =
    product.image_urls?.[0] ??
    `https://picsum.photos/seed/${product.id}/400/400`

  return (
    <article className="group cursor-pointer overflow-hidden rounded-xl border border-transparent bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg dark:bg-zinc-900 dark:hover:border-orange-900">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.is_featured && (
          <span className="absolute top-2 right-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
            ★ Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm leading-snug font-medium text-zinc-800 dark:text-zinc-100">
          {product.name}
        </h3>

        {/* Price */}
        <span className="text-base leading-none font-bold text-orange-500">
          {formatPrice(product.price)}
        </span>

        {/* Rating + Sales */}
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <StarRating rating={product.rating_avg} />
            <span className="text-xs text-zinc-500">
              {Number(product.rating_avg).toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-zinc-500">
            {formatSales(product.sales_count)} sold
          </span>
        </div>

        {/* Brand + Category badges */}
        <div className="mt-0.5 flex flex-wrap gap-1">
          {product.brand_name && (
            <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400">
              {product.brand_name}
            </span>
          )}
          {product.category_name && (
            <span className="rounded-full border border-orange-100 bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-600 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-400">
              {product.category_name}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
