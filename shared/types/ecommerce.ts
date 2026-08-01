export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
}

export interface Shop {
  id: number;
  owner_id: number | null;
  name: string;
  slug: string;
  is_active: boolean;
}

export interface Product {
  id: number;
  shop_id: number;
  category_id: number;
  brand_id: number | null;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  sales_count: number;
  rating_avg: number;
  rating_count: number;
  attributes: Record<string, string | number | boolean> | null;
  is_active: boolean;
  is_featured: boolean;
  image_urls: string[];
  created_at?: string;
  updated_at?: string;
  category_name?: string;
  brand_name?: string;
  shop_name?: string;
}
