import { notFound } from "next/navigation"
import { getProductBySlug } from "@/domains/product/product.service"
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product || product.status !== "PUBLISHED") notFound()
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold">{product.name}</h1>
      <p className="mt-2 text-muted-foreground">SKU: {product.sku}</p>
      <p className="mt-6 text-2xl">{product.price}</p>
      <p className="mt-4">{product.description}</p>
      <p className="mt-4">
        {product.variants.length
          ? `${product.variants.length} variants available`
          : product.stock > 0
            ? `${product.stock} in stock`
            : "Out of stock"}
      </p>
    </main>
  )
}
