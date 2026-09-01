"use client"

import { useMemo, useState, type ComponentType } from "react"
import {
  IconSearch,
  IconBuildingBank,
  IconBulb,
  IconCar,
  IconCategory,
  IconDeviceLaptop,
  IconHeartbeat,
  IconHome,
  IconPalette,
  IconPaw,
  IconShoppingCart,
} from "@tabler/icons-react"

import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { cn } from "@/shared/lib/utils"

export type CategoryIconKey =
  | "device-laptop"
  | "palette"
  | "home"
  | "heartbeat"
  | "bulb"
  | "car"
  | "shopping-cart"
  | "building-bank"
  | "paw"
  | "category"
export interface CategoryCard {
  id: number
  name: string
  slug: string
  group: string
  count: number
  description: string
  iconKey: CategoryIconKey
}
export interface CategoriesPageProps {
  categories?: CategoryCard[]
  className?: string
}

const iconMap: Record<
  CategoryIconKey,
  ComponentType<{
    className?: string
    stroke?: number
  }>
> = {
  "device-laptop": IconDeviceLaptop,
  palette: IconPalette,
  home: IconHome,
  heartbeat: IconHeartbeat,
  bulb: IconBulb,
  car: IconCar,
  "shopping-cart": IconShoppingCart,
  "building-bank": IconBuildingBank,
  paw: IconPaw,
  category: IconCategory,
}

export default function CategoriesPage({ categories }: CategoriesPageProps) {
  const [activeFilter, setActiveFilter] = useState("All")

  const filters = useMemo(() => {
    return ["All", ...new Set(categories?.map((c) => c.group) ?? [])]
  }, [categories])
  const [searchTerm, setSearchTerm] = useState("")

  const visibleCategories = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()

    return categories?.filter((category) => {
      const matchFilter =
        activeFilter === "All" || category.group === activeFilter

      const matchSearch =
        !keyword || category.name.toLowerCase().includes(keyword)

      return matchFilter && matchSearch
    })
  }, [categories, activeFilter, searchTerm])

  return (
    <section className="w-full">
      <header className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Explore Categories
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Discover curated collections across various industries.
        </p>
        <div className="mx-auto mt-4 h-0.5 w-16 rounded-full bg-primary" />
      </header>

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search categories"
            className="h-10 bg-card pl-9 text-sm shadow-none"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search categories..."
            value={searchTerm}
          />
        </div>

        <nav className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter}
              aria-pressed={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "h-7 rounded-full px-4 text-xs shadow-none",
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "border-border bg-card"
              )}
              size="xs"
              variant="outline"
            >
              {filter}
            </Button>
          ))}
        </nav>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {visibleCategories?.map((category) => {
          const Icon = iconMap[category.iconKey] ?? IconCategory

          return (
            <Card
              key={category.id}
              className="group min-h-40 cursor-pointer gap-0 rounded-lg border border-border bg-card py-0 shadow-none transition-colors hover:bg-muted/40"
              size="sm"
            >
              <CardContent className="flex h-full flex-col p-4">
                <div className="flex items-start justify-between">
                  <span className="grid size-9 place-items-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground">
                    <Icon className="size-8" stroke={1.4} />
                  </span>

                  <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground tabular-nums">
                    {category.count}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-semibold tracking-tight">
                  {category.name}
                </h2>

                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {visibleCategories?.length === 0 && (
        <div className="mt-6 rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          No categories match your search.
        </div>
      )}
    </section>
  )
}
