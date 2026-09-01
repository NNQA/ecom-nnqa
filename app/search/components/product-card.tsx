"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/shared/components/ui/button"
import { Star, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface Product {
  id: number
  shop_id: number
  category_id: number
  brand_id: number | null
  sku: string
  name: string
  slug: string
  description: string
  price: number
  stock: number
  sales_count: number
  rating_avg: number
  rating_count: number
  attributes: Record<string, string | number | boolean> | null
  is_active: boolean
  is_featured: boolean
  image_urls: string[]
  created_at?: string
  updated_at?: string
  category_name?: string
  brand_name?: string
  shop_name?: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Link href={`/products/${product.slug}`}>
      <div
        className="cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          {product.image_urls && product.image_urls[0] && (
            <Image
              src={product.image_urls[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {product.is_featured && (
            <div className="absolute top-2 right-2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              Featured
            </div>
          )}
          {isHovered && (
            <Button
              size="sm"
              className="absolute right-3 bottom-3 left-3 gap-2"
              onClick={(e) => {
                e.preventDefault()
                handleAddToCart()
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              {isAdded ? "Added!" : "Add to Cart"}
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          {/* Brand */}
          {product.brand_name && (
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              {product.brand_name}
            </p>
          )}

          {/* Product Name */}
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(product.rating_avg)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.rating_count})
            </span>
          </div>

          {/* Price */}
          <div className="text-lg font-semibold text-foreground">
            ${product.price.toFixed(2)}
          </div>

          {/* Stock Status */}
          {product.stock <= 10 && product.stock > 0 && (
            <p className="text-xs text-yellow-600">
              Only {product.stock} left in stock
            </p>
          )}
          {product.stock === 0 && (
            <p className="text-xs text-red-600">Out of stock</p>
          )}
        </div>
      </div>
    </Link>
  )
}
