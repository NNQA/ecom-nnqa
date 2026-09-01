"use client"

import { Label } from "@/shared/components/ui/label"
import { SidebarInput } from "@/shared/components/ui/sidebar"
import { IconSearch } from "@tabler/icons-react"
import { cn } from "../lib/utils"

interface SearchFormProps extends React.ComponentProps<"form"> {
  className?: string
  placeholdertext?: string
}
export function SearchForm({
  className,
  placeholdertext,
  ...props
}: SearchFormProps) {
  return (
    <form {...props} className={cn(className)}>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          id="search"
          placeholder={placeholdertext ? placeholdertext : "Type to search..."}
          className="h-10 pl-7"
        />
        <IconSearch className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      </div>
    </form>
  )
}
