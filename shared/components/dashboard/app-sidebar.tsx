"use client"

import * as React from "react"

import { NavMain } from "@/shared/components/dashboard/nav-main"
import { NavProjects } from "@/shared/components/dashboard/nav-projects"
import { NavSecondary } from "@/shared/components/dashboard/nav-secondary"
import { NavUser } from "@/shared/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar"
import {
  IconBox,
  IconCategory,
  IconChartBar,
  IconCommand,
  IconCreditCard,
  IconDashboard,
  IconDiscount2,
  IconHelp,
  IconLifebuoy,
  IconMessage,
  IconPackage,
  IconReceipt,
  IconReceipt2,
  IconSettings,
  IconShieldLock,
  IconShoppingCart,
  IconTruck,
  IconUsers,
} from "@tabler/icons-react"
const data = {
  user: {
    name: "Administrator",
    email: "admin@nnqa.store",
    avatar: "/avatars/admin.png",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: <IconDashboard />,
      isActive: true,
    },
    {
      title: "Catalog",
      url: "/catalog",
      icon: <IconBox />,
      items: [
        { title: "Products", url: "/products" },
        { title: "Categories", url: "/categories" },
        { title: "Brands", url: "/brands" },
        { title: "Inventory", url: "/inventory" },
      ],
    },
    {
      title: "Orders",
      url: "/orders",
      icon: <IconShoppingCart />,
      items: [
        { title: "All Orders", url: "/orders" },
        { title: "Returns", url: "/returns" },
        { title: "Shipping", url: "/shipping" },
      ],
    },
    {
      title: "Customers",
      url: "/customers",
      icon: <IconUsers />,
      items: [
        { title: "Customers", url: "/customers" },
        { title: "Reviews", url: "/reviews" },
      ],
    },
    {
      title: "System",
      url: "/system",
      icon: <IconShieldLock />,
      items: [
        { title: "Users", url: "/users" },
        { title: "Roles", url: "/roles" },
        { title: "Permissions", url: "/permissions" },
      ],
    },
  ],

  // Thay "Projects" thành các module truy cập nhanh
  projects: [
    {
      name: "Products",
      url: "/products",
      icon: <IconPackage />,
    },
    {
      name: "Orders",
      url: "/orders",
      icon: <IconReceipt2 />,
    },
    {
      name: "Customers",
      url: "/customers",
      icon: <IconUsers />,
    },
    {
      name: "Analytics",
      url: "/analytics",
      icon: <IconChartBar />,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: <IconSettings />,
    },
    {
      title: "Support",
      url: "/support",
      icon: <IconLifebuoy />,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: <IconMessage />,
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <IconCommand className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Nnqa Inc</span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
