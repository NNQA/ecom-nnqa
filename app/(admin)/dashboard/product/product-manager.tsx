"use client"
import { useState, useTransition } from "react"
import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/domains/product/actions/product.actions"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { toast } from "sonner"

type Product = {
  id: number
  categoryId: number
  name: string
  sku: string
  description: string | null
  price: number
  stock: number
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  variants: {
    sku: string
    name: string
    price: number
    stock: number
    imageUrl: string | null
  }[]
}
const blank = {
  name: "",
  sku: "",
  categoryId: "",
  description: "",
  price: "0",
  stock: "0",
  status: "DRAFT" as Product["status"],
}
export function ProductManager({ products }: { products: Product[] }) {
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(blank)
  const [variants, setVariants] = useState<Product["variants"]>([])
  const [pending, start] = useTransition()
  function open(p?: Product) {
    setEditing(p ?? null)
    setForm(
      p
        ? {
            name: p.name,
            sku: p.sku,
            categoryId: String(p.categoryId),
            description: p.description ?? "",
            price: String(p.price),
            stock: String(p.stock),
            status: p.status,
          }
        : blank
    )
    setVariants(p?.variants ?? [])
  }
  function payload() {
    return {
      shopId: null,
      categoryId: Number(form.categoryId),
      name: form.name,
      sku: form.sku,
      description: form.description || null,
      price: Number(form.price),
      stock: Number(form.stock),
      images: [],
      status: form.status,
      variants,
    }
  }
  function submit(e: React.FormEvent) {
    e.preventDefault()
    start(async () => {
      const r = editing
        ? await updateProductAction(editing.id, payload())
        : await createProductAction(payload())
      if (r.error) toast.error(r.error)
      else {
        toast.success(editing ? "Product updated" : "Product created")
        open()
        location.reload()
      }
    })
  }
  function remove(id: number) {
    start(async () => {
      const r = await deleteProductAction(id)
      if (r.error) toast.error(r.error)
      else {
        toast.success("Product deleted")
        location.reload()
      }
    })
  }
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {p.sku} · {p.price}
                  </p>
                  <Badge variant="secondary">{p.status}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => open(p)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => remove(p.id)}
                    disabled={pending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Edit product" : "Create product"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3" onSubmit={submit}>
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              placeholder="SKU"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              required
            />
            <Input
              placeholder="Category ID"
              type="number"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <Input
              placeholder="Price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <Input
              placeholder="Stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            <Select
              value={form.status}
              onValueChange={(v) =>
                setForm({ ...form, status: v as Product["status"] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
            <div className="rounded-md border p-3">
              <p className="mb-2 text-sm font-medium">Variants</p>
              {variants.map((v, i) => (
                <div key={i} className="mb-2 grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Name"
                    value={v.name}
                    onChange={(e) =>
                      setVariants(
                        variants.map((x, j) =>
                          j === i ? { ...x, name: e.target.value } : x
                        )
                      )
                    }
                  />
                  <Input
                    placeholder="SKU"
                    value={v.sku}
                    onChange={(e) =>
                      setVariants(
                        variants.map((x, j) =>
                          j === i ? { ...x, sku: e.target.value } : x
                        )
                      )
                    }
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    value={v.price}
                    onChange={(e) =>
                      setVariants(
                        variants.map((x, j) =>
                          j === i ? { ...x, price: Number(e.target.value) } : x
                        )
                      )
                    }
                  />
                  <Input
                    placeholder="Stock"
                    type="number"
                    value={v.stock}
                    onChange={(e) =>
                      setVariants(
                        variants.map((x, j) =>
                          j === i ? { ...x, stock: Number(e.target.value) } : x
                        )
                      )
                    }
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setVariants([
                    ...variants,
                    {
                      sku: "",
                      name: "",
                      price: Number(form.price) || 0,
                      stock: 0,
                      imageUrl: null,
                    },
                  ])
                }
              >
                Add variant
              </Button>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={pending}>
                {editing ? "Save changes" : "Create product"}
              </Button>
              {editing && (
                <Button type="button" variant="ghost" onClick={() => open()}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
