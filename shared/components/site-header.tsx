"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SearchForm } from "@/shared/components/search-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb"
import { Button } from "@/shared/components/ui/button"
import { Separator } from "@/shared/components/ui/separator"
import { useSidebar } from "@/shared/components/ui/sidebar"
import { IconLayoutSidebar } from "@tabler/icons-react"

function formatSegment(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
import { Fragment } from "react"
export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname()

  const segments = pathname.split("/").filter(Boolean)

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={toggleSidebar}
        >
          <IconLayoutSidebar />
        </Button>

        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4"
        />

        <Breadcrumb className="hidden md:block">
          <BreadcrumbList>
            {segments.map((segment, index) => {
              const href = "/" + segments.slice(0, index + 1).join("/")
              const isLast = index === segments.length - 1

              return (
                <Fragment key={href}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        render={
                          <Link href={href}>{formatSegment(segment)}</Link>
                        }
                      />
                    )}
                  </BreadcrumbItem>

                  {!isLast && <BreadcrumbSeparator />}
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>

        <SearchForm className="ml-auto w-full sm:w-auto" />
      </div>
    </header>
  )
}