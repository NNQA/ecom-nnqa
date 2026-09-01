import { IconCategory } from "@tabler/icons-react"
import { ComponentType } from "react"
import { CategoryIconKey } from "../pages"

export const categoryIconMap: Record<string, CategoryIconKey> = {
  electronics: "device-laptop",
  fashion: "palette",
  "home-living": "home",
  beauty: "palette",
  sports: "heartbeat",
  books: "bulb",
  automotive: "car",
  toys: "shopping-cart",
  "food-beverage": "building-bank",
  "pet-supplies": "paw",
}

export const defaultCategoryIcon = IconCategory
export const categoryGroupMap: Record<string, string> = {
  electronics: "Technology",
  fashion: "Lifestyle",
  books: "Lifestyle",
  sports: "Lifestyle",
  automotive: "Business",
  beauty: "Lifestyle",
  "home-living": "Lifestyle",
  "food-beverage": "Lifestyle",
  toys: "Lifestyle",
  "pet-supplies": "Lifestyle",
}

export const categoryDescriptionMap: Record<string, string> = {
  electronics: "Latest gadgets and electronic devices.",
  fashion: "Clothing, shoes and fashion accessories.",
  "home-living": "Furniture and home essentials.",
  beauty: "Skincare, cosmetics and personal care.",
  sports: "Sports equipment and outdoor gear.",
  books: "Books, novels and educational materials.",
  automotive: "Car and motorcycle accessories.",
  toys: "Toys and games for all ages.",
  "food-beverage": "Food, drinks and groceries.",
  "pet-supplies": "Everything for your lovely pets.",
}
