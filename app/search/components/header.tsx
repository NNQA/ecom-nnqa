import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-foreground">
          EssentialHub
        </Link>
        <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
          <Link
            href="/search"
            className="transition-colors hover:text-foreground"
          >
            Products
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            Categories
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            Deals
          </Link>
        </nav>
      </div>
    </header>
  )
}
