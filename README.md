# 🚀 MarketX - Flexible Online Marketplace Platform

A personal project building a simplified, multi-vendor e-commerce marketplace platform focused on scalability and optimized business workflows.

---

## I. Product Discovery

### 1. Market Context

- **Problem:** Currently, sellers have to manually list products across multiple platforms, while buyers struggle to find suitable items.
- **Solution:** MarketX provides a centralized platform that seamlessly connects Sellers (Merchants) and Buyers (Customers).

### 2. Vision

Simplify the online shopping experience. Become the **most flexible marketplace platform** with high adaptability and scalability.

### 3. Mission

Connect merchants and suppliers with customers, creating a modern, scalable, and sustainable e-commerce ecosystem.

### 4. Target Users & Personas

| Persona         | Description                         |
| :-------------- | :---------------------------------- |
| **Guest**       | Unauthenticated visitor.            |
| **Customer**    | Authenticated buyer.                |
| **Merchant**    | Store owner / Seller.               |
| **Staff**       | Store operator / Employee.          |
| **Admin**       | Platform operations administrator.  |
| **Super Admin** | Chief administrator / System owner. |

### 5. Competitor Analysis

| Platform        | Pros                                        | Cons                                    |
| :-------------- | :------------------------------------------ | :-------------------------------------- |
| **Shopee**      | Vast product catalog, huge traffic.         | Complex UI/UX, feature bloat.           |
| **Lazada**      | Strong logistics network.                   | Fewer individual/small-scale sellers.   |
| **TikTok Shop** | High conversion via Livestream/Short video. | Complex inventory and order management. |

### 6. Business Goal

- Allow **Merchants** to register, set up storefronts, and list products.
- Allow **Customers** to browse, add items to cart, and place orders.
- Allow **Admins / Super Admins** to moderate, operate, and manage platform workflows and financial settlements.

---

## II. Business Model & Architecture

### 1. System Overview

MarketX is a multi-vendor e-commerce marketplace acting as an intermediary between Supply and Demand. The system architecture follows a **Domain-Driven Modular** approach split into 4 core domains:

1. **Platform Layer:** Platform governance and settlement policies.
2. **Supply Side:** Merchant and catalog management.
3. **Demand Side:** Customer experience and shopping cart management.
4. **Fulfillment & Feedback:** Payments, shipping, and post-purchase feedback.

---

### 2. Domains Breakdown

#### 🔹 Platform Layer

- Represents the platform administration (`Platform Owner`).
- Responsible for defining policies (**Policies**), governance rules (**Governance**), and fee structures (**Fees**).
- Approves (**onboards**) merchants and settles net funds (**settles**) via payment gateways.

#### 🔹 Supply Side

- **Merchant:** Verified individual or business seller account.
- **Product:** Listed and managed (**lists**) by Merchants, including catalog details and prices.

#### 🔹 Demand Side

- **Customer:** Represents the buyer profile.
- **Order:** Initiated when customers add products to cart (**added to**) and place orders (**places**). Stores cart state and items.

#### 🔹 Fulfillment & Feedback

- **Payment:** Handles customer payments (**pays**). Manages charges and merchant payouts based on platform rules.
- **Shipping:** Triggered upon successful payment for order fulfillment (**requires**). Customers receive items (**receives**) and track shipment status.
- **Review:** Prompts (**prompts**) customers to rate (**rates**) purchased products, forming a post-purchase feedback loop.

---

### 3. Core Business Flow

```text
[Merchant Register] ──► [Admin Approve] ──► [Merchant List Product]
                                                      │
[Review Product] ◄── [Receive Goods] ◄── [Ship Order] ◄── [Customer Place & Pay Order]
        │
        └──► [Platform Settle Funds to Merchant]
```
