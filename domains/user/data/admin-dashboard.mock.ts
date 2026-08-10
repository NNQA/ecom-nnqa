export type DashboardMetric = {
  label: string
  value: string
  change: string
  comparison: string
  trend: "up" | "down"
}

export type DashboardOrder = {
  id: string
  customer: { name: string; initials: string }
  date: string
  amount: string
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
}

// Temporary dashboard read model. Replace these values with domain service results
// when the user, order, product, shop, and payment read APIs are available.
export const adminDashboardData = {
  metrics: [
    {
      label: "Total revenue",
      value: "$128,430",
      change: "12.5%",
      comparison: "vs. previous 30 days",
      trend: "up",
    },
    {
      label: "Orders",
      value: "3,482",
      change: "8.2%",
      comparison: "vs. previous 30 days",
      trend: "up",
    },
    {
      label: "Users",
      value: "18,905",
      change: "5.4%",
      comparison: "vs. previous 30 days",
      trend: "up",
    },
    {
      label: "Active shops",
      value: "1,248",
      change: "2.1%",
      comparison: "vs. previous 30 days",
      trend: "down",
    },
  ] satisfies DashboardMetric[],
  revenueTrend: [
    { label: "Mon", revenue: 58, orders: 42 },
    { label: "Tue", revenue: 73, orders: 55 },
    { label: "Wed", revenue: 61, orders: 48 },
    { label: "Thu", revenue: 84, orders: 64 },
    { label: "Fri", revenue: 91, orders: 70 },
    { label: "Sat", revenue: 76, orders: 58 },
    { label: "Sun", revenue: 96, orders: 73 },
  ],
  orders: [
    {
      id: "#ORD-10482",
      customer: { name: "Olivia Bennett", initials: "OB" },
      date: "Today, 10:42 AM",
      amount: "$248.00",
      status: "Processing",
    },
    {
      id: "#ORD-10481",
      customer: { name: "Marcus Chen", initials: "MC" },
      date: "Today, 9:18 AM",
      amount: "$89.50",
      status: "Shipped",
    },
    {
      id: "#ORD-10480",
      customer: { name: "Amelia Grant", initials: "AG" },
      date: "Yesterday",
      amount: "$1,240.00",
      status: "Delivered",
    },
    {
      id: "#ORD-10479",
      customer: { name: "Noah Williams", initials: "NW" },
      date: "Yesterday",
      amount: "$64.00",
      status: "Pending",
    },
    {
      id: "#ORD-10478",
      customer: { name: "Sofia Patel", initials: "SP" },
      date: "Aug 7, 2026",
      amount: "$315.75",
      status: "Delivered",
    },
    {
      id: "#ORD-10477",
      customer: { name: "Ethan Brooks", initials: "EB" },
      date: "Aug 7, 2026",
      amount: "$42.00",
      status: "Cancelled",
    },
  ] satisfies DashboardOrder[],
  products: [
    {
      name: "Aurora Wireless Headphones",
      category: "Electronics",
      sales: "1,204 sold",
      revenue: "$18,060",
      icon: "headphones",
    },
    {
      name: "Linen Everyday Shirt",
      category: "Fashion",
      sales: "982 sold",
      revenue: "$14,730",
      icon: "shirt",
    },
    {
      name: "Ceramic Pour-Over Set",
      category: "Home & Living",
      sales: "746 sold",
      revenue: "$11,190",
      icon: "cup",
    },
    {
      name: "Trail Running Shoes",
      category: "Sports",
      sales: "618 sold",
      revenue: "$9,888",
      icon: "shoe",
    },
  ],
  activity: [
    {
      title: "Olivia Bennett joined the marketplace",
      detail: "New customer account",
      time: "12 minutes ago",
      type: "user",
    },
    {
      title: "Northstar Goods submitted verification",
      detail: "Shop review required",
      time: "38 minutes ago",
      type: "shop",
    },
    {
      title: "Order #ORD-10480 was completed",
      detail: "$1,240.00 payment captured",
      time: "1 hour ago",
      type: "order",
    },
    {
      title: "New product published",
      detail: "Trail Running Shoes",
      time: "2 hours ago",
      type: "product",
    },
    {
      title: "Weekly payout was processed",
      detail: "$24,680.00 sent to sellers",
      time: "4 hours ago",
      type: "payment",
    },
  ],
}
