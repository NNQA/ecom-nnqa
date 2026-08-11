"use client"

import * as React from "react"

import { NavMain } from "@/shared/components/dashboard/nav-main"
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
  IconBell,
  IconBox,
  IconBuildingStore,
  IconCommand,
  IconCreditCard,
  IconDashboard,
  IconPackage,
  IconSettings,
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
      url: "/dashboard",
      icon: <IconDashboard />,
      isActive: true,
    },
    { title: "Users", url: "/dashboard/users", icon: <IconUsers /> },
    { title: "Shops", url: "/dashboard/shops", icon: <IconBuildingStore /> },
    { title: "Products", url: "/dashboard/product", icon: <IconPackage /> },
    { title: "Orders", url: "/dashboard/orders", icon: <IconShoppingCart /> },
    { title: "Inventory", url: "/dashboard/inventory", icon: <IconBox /> },
    { title: "Payments", url: "/dashboard/payments", icon: <IconCreditCard /> },
    { title: "Shipments", url: "/dashboard/shipments", icon: <IconTruck /> },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: <IconBell />,
    },
  ],
  navSecondary: [
    { title: "Settings", url: "/dashboard/settings", icon: <IconSettings /> },
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
            <SidebarMenuButton size="lg" render={<a href="/dashboard" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <IconCommand className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Nnqa Inc</span>
                <span className="truncate text-xs">Marketplace admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
