import { ReactNode } from "react"
import { Pagination } from "../pagination"
import Footer from "../ui/footer"
import Logo from "../ui/logo"

interface SearchLayoutProps {
  children?: ReactNode
}

function SearchLayout({ children }: SearchLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Pagination />
      <div className="mx-auto w-full">{children}</div>
      <Footer />
    </div>
  )
}

export default SearchLayout
