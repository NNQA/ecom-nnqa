'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/shared/components/ui/button'
import { Star, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

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
                className="bg-card border border-border rounded-lg overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container */}
                <div className="relative w-full h-48 bg-muted overflow-hidden">
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
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                            Featured
                        </div>
                    )}
                    {isHovered && (
                        <Button
                            size="sm"
                            className="absolute bottom-3 left-3 right-3 gap-2"
                            onClick={(e) => {
                                e.preventDefault()
                                handleAddToCart()
                            }}
                        >
                            <ShoppingCart className="h-4 w-4" />
                            {isAdded ? 'Added!' : 'Add to Cart'}
                        </Button>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    {/* Brand */}
                    {product.brand_name && (
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            {product.brand_name}
                        </p>
                    )}

                    {/* Product Name */}
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3.5 w-3.5 ${i < Math.round(product.rating_avg)
                                        ? 'fill-yellow-500 text-yellow-500'
                                        : 'text-muted-foreground'
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
                        <p className="text-xs text-yellow-600">Only {product.stock} left in stock</p>
                    )}
                    {product.stock === 0 && (
                        <p className="text-xs text-red-600">Out of stock</p>
                    )}
                </div>
            </div>
        </Link>
    )
}
