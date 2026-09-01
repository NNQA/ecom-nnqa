import React from "react"
import { Pagination } from "../pagination"
import Logo from "../ui/logo"
import Footer from "../ui/footer"
import { cn } from "@/shared/lib/utils"

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="bg-background">
      <Pagination />
      <div className={cn("md:1/2 mx-auto", className)}>
        <div className="mb-8 flex items-center justify-center md:hidden">
          <Logo size="lg" showText />
        </div>
        {children}
      </div>
      <Footer />
    </div>
  )
}
