import Link from "next/link"
import { getProducts } from "@/domains/product/product.service"
export default async function Page() {
  const { products } = await getProducts({ status: "PUBLISHED", pageSize: 100 })
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-semibold">Products</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="rounded-lg border p-4 hover:bg-muted"
          >
            <h2 className="font-medium">{p.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {p.description}
            </p>
            <p className="mt-4 font-semibold">{p.price}</p>
          </Link>
        ))}
      </div>
      {products.length === 0 && (
        <p className="mt-8 text-muted-foreground">
          No published products available.
        </p>
      )}
    </main>
  )
}
