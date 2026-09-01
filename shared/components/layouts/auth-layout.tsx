import { ReactNode } from "react"
import { Pagination } from "../pagination"
import Footer from "../ui/footer"
import Logo from "../ui/logo"

interface AuthLayoutProps {
  children?: ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Pagination />
      <div className="mx-auto w-full px-4 py-12 md:w-1/2">
        <div className="mx-auto max-w-md">
          <div className="mb-8 flex items-center justify-center md:hidden">
            <Logo size="lg" showText />
          </div>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AuthLayout
