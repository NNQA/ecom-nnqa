"use client"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Label } from "@/shared/components/ui/label"
import { Slider } from "@/shared/components/ui/slider"
import { Star } from "lucide-react"

const categories = ["Electronics", "Apparel", "Accessories", "Home & Garden"]
const brands = ["TechBrand", "AudioPro", "EcoWear", "DenimCo", "HydroWorks"]
const ratings = [5, 4, 3, 2, 1]

interface SidebarProps {
  onFilterChange: (filters: Record<string, unknown>) => void
}

export default function Sidebar({ onFilterChange }: SidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)

  const handlePriceChange = (value: number | readonly number[]) => {
    const newRange = Array.isArray(value)
      ? [value[0] ?? 0, value[1] ?? 0]
      : [value, value]

    setPriceRange(newRange)
    onFilterChange({
      minPrice: newRange[0],
      maxPrice: newRange[1],
      category: selectedCategory,
    })
  }

  const handleCategoryChange = (category: string) => {
    const newCategory = selectedCategory === category ? null : category
    setSelectedCategory(newCategory)
    onFilterChange({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      category: newCategory,
    })
  }

  const handleBrandChange = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand]
    setSelectedBrands(newBrands)
  }

  const handleRatingChange = (rating: number) => {
    const newRating = selectedRating === rating ? null : rating
    setSelectedRating(newRating)
    onFilterChange({ minRating: newRating })
  }

  const handleReset = () => {
    setPriceRange([0, 500])
    setSelectedCategory(null)
    setSelectedBrands([])
    setSelectedRating(null)
    onFilterChange({
      minPrice: 0,
      maxPrice: 500,
      category: null,
    })
  }

  return (
    <aside className="">
      <div>
        <h3 className="mb-4 text-sm font-medium text-foreground">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`block text-left text-sm transition-colors ${
                selectedCategory === category
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium text-foreground">
          Price Range
        </h3>
        <Slider
          min={0}
          max={500}
          step={10}
          value={priceRange}
          onValueChange={handlePriceChange}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium text-foreground">Brands</h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={brand}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => handleBrandChange(brand)}
              />
              <Label
                htmlFor={brand}
                className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-medium text-foreground">Rating</h3>
        <div className="space-y-3">
          {ratings.map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`flex w-full items-center gap-1 rounded p-2 text-sm transition-colors hover:bg-muted ${
                selectedRating === rating ? "bg-muted" : ""
              }`}
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">& up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Apply Filters Button */}
      <Button variant="default" className="w-full">
        Apply Filters
      </Button>

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full border-border"
        onClick={handleReset}
      >
        Reset
      </Button>
    </aside>
  )
}
