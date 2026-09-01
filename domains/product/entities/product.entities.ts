export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"
export interface ProductVariant {
  id: number
  productId: number
  sku: string
  name: string
  price: number
  stock: number
  imageUrl: string | null
}
export interface Product {
  id: number
  shopId: number | null
  categoryId: number
  name: string
  slug: string
  sku: string
  description: string | null
  price: number
  stock: number
  images: string[]
  status: ProductStatus
  createdAt: Date
  updatedAt: Date
  variants: ProductVariant[]
}
