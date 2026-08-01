'use client'

import { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Sidebar from './components/sidebar'
import Header from './components/header'

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

const mockProducts: Product[] = [
    {
        id: 1,
        shop_id: 1,
        category_id: 1,
        brand_id: 1,
        sku: 'PROD-001',
        name: 'Premium Wireless Headphones',
        slug: 'premium-wireless-headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199.99,
        stock: 50,
        sales_count: 230,
        rating_avg: 4.5,
        rating_count: 120,
        attributes: { color: 'black', battery: '30h' },
        is_active: true,
        is_featured: true,
        image_urls: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
        category_name: 'Electronics',
        brand_name: 'TechBrand',
    },
    {
        id: 2,
        shop_id: 1,
        category_id: 1,
        brand_id: 2,
        sku: 'PROD-002',
        name: 'Portable Bluetooth Speaker',
        slug: 'portable-bluetooth-speaker',
        description: 'Waterproof portable speaker with 360-degree sound',
        price: 79.99,
        stock: 120,
        sales_count: 456,
        rating_avg: 4.8,
        rating_count: 340,
        attributes: { color: 'blue', waterproof: 'IP67' },
        is_active: true,
        is_featured: true,
        image_urls: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'],
        category_name: 'Electronics',
        brand_name: 'AudioPro',
    },
    {
        id: 3,
        shop_id: 1,
        category_id: 2,
        brand_id: 3,
        sku: 'PROD-003',
        name: 'Organic Cotton T-Shirt',
        slug: 'organic-cotton-tshirt',
        description: 'Comfortable and sustainable organic cotton shirt',
        price: 34.99,
        stock: 200,
        sales_count: 670,
        rating_avg: 4.3,
        rating_count: 89,
        attributes: { size: 'M', color: 'white' },
        is_active: true,
        is_featured: false,
        image_urls: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
        category_name: 'Apparel',
        brand_name: 'EcoWear',
    },
    {
        id: 4,
        shop_id: 1,
        category_id: 1,
        brand_id: 1,
        sku: 'PROD-004',
        name: '4K Webcam',
        slug: '4k-webcam',
        description: 'Professional 4K webcam for streaming and conferencing',
        price: 149.99,
        stock: 75,
        sales_count: 189,
        rating_avg: 4.6,
        rating_count: 95,
        attributes: { resolution: '4K', fps: '60' },
        is_active: true,
        is_featured: true,
        image_urls: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'],
        category_name: 'Electronics',
        brand_name: 'TechBrand',
    },
    {
        id: 5,
        shop_id: 1,
        category_id: 2,
        brand_id: 4,
        sku: 'PROD-005',
        name: 'Premium Denim Jeans',
        slug: 'premium-denim-jeans',
        description: 'Classic fit denim jeans made from premium fabric',
        price: 89.99,
        stock: 150,
        sales_count: 420,
        rating_avg: 4.4,
        rating_count: 210,
        attributes: { size: '32', color: 'dark blue' },
        is_active: true,
        is_featured: false,
        image_urls: ['https://images.unsplash.com/photo-1542272604-787c62e4dc41?w=500'],
        category_name: 'Apparel',
        brand_name: 'DenimCo',
    },
    {
        id: 6,
        shop_id: 1,
        category_id: 3,
        brand_id: 5,
        sku: 'PROD-006',
        name: 'Stainless Steel Water Bottle',
        slug: 'stainless-steel-water-bottle',
        description: 'Insulated water bottle keeps drinks hot or cold for 24 hours',
        price: 44.99,
        stock: 180,
        sales_count: 890,
        rating_avg: 4.7,
        rating_count: 560,
        attributes: { capacity: '750ml', color: 'silver' },
        is_active: true,
        is_featured: true,
        image_urls: ['https://images.unsplash.com/photo-1602143407151-7111542de6e9?w=500'],
        category_name: 'Accessories',
        brand_name: 'HydroWorks',
    },
]

export default function SearchPage() {
    const searchParams = useSearchParams()
    const [sortBy, setSortBy] = useState('featured')
    const [products, setProducts] = useState<Product[]>(mockProducts)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState(searchParams?.get('q') || '')

    const itemsPerPage = 6
    const totalPages = Math.ceil(products.length / itemsPerPage)
    const startIdx = (currentPage - 1) * itemsPerPage
    const paginatedProducts = products.slice(startIdx, startIdx + itemsPerPage)

    const handleSearch = useCallback(
        (term: string) => {
            setSearchTerm(term)
            setCurrentPage(1)
            if (term.trim()) {
                const filtered = mockProducts.filter(
                    (p) =>
                        p.name.toLowerCase().includes(term.toLowerCase()) ||
                        p.description.toLowerCase().includes(term.toLowerCase())
                )
                setProducts(filtered)
            } else {
                setProducts(mockProducts)
            }
        },
        []
    )

    const handleSort = (value: string | null) => {
        if (value === null) return
        setSortBy(value)
        const sorted = [...products]
        switch (value) {
            case 'price-low':
                sorted.sort((a, b) => a.price - b.price)
                break
            case 'price-high':
                sorted.sort((a, b) => b.price - a.price)
                break
            case 'rating':
                sorted.sort((a, b) => b.rating_avg - a.rating_avg)
                break
            case 'newest':
                sorted.sort((a, b) => {
                    if (!a.created_at || !b.created_at) return 0
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                })
                break
            default:
                sorted.sort((a, b) => b.is_featured ? 1 : -1)
        }
        setProducts(sorted)
    }

    const handleFilterChange = (filters: Record<string, any>) => {
        // Apply filters to products
        let filtered = mockProducts
        if (filters.minPrice !== undefined) {
            filtered = filtered.filter((p) => p.price >= filters.minPrice)
        }
        if (filters.maxPrice !== undefined) {
            filtered = filtered.filter((p) => p.price <= filters.maxPrice)
        }
        if (filters.category) {
            filtered = filtered.filter((p) => p.category_name === filters.category)
        }
        if (filters.minRating !== undefined) {
            filtered = filtered.filter((p) => p.rating_avg >= filters.minRating)
        }
        setProducts(filtered)
        setCurrentPage(1)
    }

    return (
        <div className="bg-background min-h-screen">
            <div className='flex flex-col lg:flex-row max-w-7xl mx-auto px-6 py-8 gap-8'>
                <Sidebar onFilterChange={handleFilterChange} />
            </div>
        </div>
    )
}
