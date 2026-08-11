import { adminDashboardData } from "@/domains/user/data/admin-dashboard.mock"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip"
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconBell,
  IconBuildingStore,
  IconCurrencyDollar,
  IconCup,
  IconHeadphones,
  IconPackage,
  IconReceipt,
  IconShirt,
  IconShoe,
  IconShoppingCart,
  IconUsers,
} from "@tabler/icons-react"
import type { ComponentType } from "react"

const metricIcons: ComponentType<{ className?: string }>[] = [
  IconCurrencyDollar,
  IconShoppingCart,
  IconUsers,
  IconBuildingStore,
]
const productIcons = {
  headphones: IconHeadphones,
  shirt: IconShirt,
  cup: IconCup,
  shoe: IconShoe,
}
const activityIcons = {
  user: IconUsers,
  shop: IconBuildingStore,
  order: IconReceipt,
  product: IconPackage,
  payment: IconCurrencyDollar,
}
const statusClasses = {
  Pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Processing: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  Shipped: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  Delivered: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Cancelled: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
}

function PageDashboard() {
  const { metrics, revenueTrend, orders, products, activity } =
    adminDashboardData

  return (
    <main className="min-h-full bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Overview of your marketplace performance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Notifications"
                  />
                }
              >
                <IconBell />
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
            <Avatar aria-label="Administrator profile">
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <section
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Marketplace overview"
        >
          {metrics.map((metric, index) => {
            const MetricIcon = metricIcons[index]
            const TrendIcon =
              metric.trend === "up" ? IconArrowUpRight : IconArrowDownRight
            return (
              <Card key={metric.label} size="sm" className="gap-4">
                <CardHeader>
                  <CardDescription className="flex items-center justify-between">
                    {metric.label}
                    <span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <MetricIcon className="size-4" />
                    </span>
                  </CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    {metric.value}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span
                    className={
                      metric.trend === "up"
                        ? "inline-flex items-center font-medium text-emerald-700 dark:text-emerald-400"
                        : "inline-flex items-center font-medium text-rose-700 dark:text-rose-400"
                    }
                  >
                    <TrendIcon className="mr-0.5 size-3.5" />
                    {metric.change}
                  </span>
                  <span>{metric.comparison}</span>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(20rem,0.85fr)]">
          <Card>
            <CardHeader className="border-b">
              <div>
                <CardTitle>Revenue and orders</CardTitle>
                <CardDescription>
                  Marketplace activity over the last 7 days
                </CardDescription>
              </div>
              <div className="col-start-2 row-start-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <i className="size-2 rounded-full bg-foreground" />
                  Revenue
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="size-2 rounded-full bg-muted-foreground/40" />
                  Orders
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div
                className="grid h-64 grid-cols-7 items-end gap-2 border-b border-dashed border-border pb-1 sm:gap-4"
                role="img"
                aria-label="Revenue and order trend increased during the past seven days"
              >
                {revenueTrend.map((day) => (
                  <div
                    key={day.label}
                    className="flex h-full flex-col justify-end gap-1.5"
                  >
                    <div
                      className="mx-auto w-full max-w-10 rounded-t-sm bg-muted-foreground/35"
                      style={{ height: `${day.orders}%` }}
                      title={`${day.orders} orders`}
                    />
                    <div
                      className="mx-auto -mt-3 w-full max-w-10 rounded-t-sm bg-foreground"
                      style={{ height: `${day.revenue}%` }}
                      title={`$${day.revenue}k revenue`}
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 pt-2 text-center text-xs text-muted-foreground sm:gap-4">
                {revenueTrend.map((day) => (
                  <span key={day.label}>{day.label}</span>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>
                Latest events across your marketplace
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ol className="divide-y">
                {activity.map((item) => {
                  const ActivityIcon =
                    activityIcons[item.type as keyof typeof activityIcons]
                  return (
                    <li
                      key={item.title}
                      className="flex gap-3 py-3 first:pt-2 last:pb-0"
                    >
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <ActivityIcon className="size-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {item.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.detail}
                        </p>
                      </div>
                      <time className="ml-auto shrink-0 text-xs text-muted-foreground">
                        {item.time}
                      </time>
                    </li>
                  )
                })}
              </ol>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(20rem,0.85fr)]">
          <Card>
            <CardHeader className="border-b">
              <div>
                <CardTitle>Recent orders</CardTitle>
                <CardDescription>
                  Most recent marketplace transactions
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="col-start-2 row-start-1"
              >
                View all
              </Button>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2">
                            <Avatar size="sm">
                              <AvatarFallback>
                                {order.customer.initials}
                              </AvatarFallback>
                            </Avatar>
                            {order.customer.name}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {order.date}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClasses[order.status]}`}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums">
                          {order.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="divide-y md:hidden">
                {orders.map((order) => (
                  <article key={order.id} className="py-3 first:pt-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{order.id}</span>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClasses[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Avatar size="sm">
                          <AvatarFallback>
                            {order.customer.initials}
                          </AvatarFallback>
                        </Avatar>
                        {order.customer.name}
                      </span>
                      <span className="font-medium">{order.amount}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {order.date}
                    </p>
                  </article>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Top products</CardTitle>
              <CardDescription>By revenue in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ol className="divide-y">
                {products.map((product) => {
                  const ProductIcon =
                    productIcons[product.icon as keyof typeof productIcons]
                  return (
                    <li
                      key={product.name}
                      className="flex items-center gap-3 py-3 first:pt-2 last:pb-0"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <ProductIcon className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.category} · {product.sales}
                        </p>
                      </div>
                      <span className="text-sm font-medium tabular-nums">
                        {product.revenue}
                      </span>
                    </li>
                  )
                })}
              </ol>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}

export default PageDashboard
