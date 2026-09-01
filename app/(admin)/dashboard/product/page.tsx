import { getProducts } from "@/domains/product/product.service"
import { ProductManager } from "./product-manager"
export default async function Page() {
  const { products } = await getProducts({ pageSize: 100 })
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage marketplace products, status, stock, and variants.
        </p>
      </header>
      <ProductManager products={products} />
    </main>
  )
}
