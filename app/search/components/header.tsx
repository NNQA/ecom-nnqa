import Link from 'next/link'

export default function Header() {
    return (
        <header className="border-b border-border bg-background sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="text-lg font-semibold text-foreground">
                    EssentialHub
                </Link>
                <nav className="hidden md:flex gap-6 text-sm text-muted-foreground">
                    <Link href="/search" className="hover:text-foreground transition-colors">
                        Products
                    </Link>
                    <Link href="#" className="hover:text-foreground transition-colors">
                        Categories
                    </Link>
                    <Link href="#" className="hover:text-foreground transition-colors">
                        Deals
                    </Link>
                </nav>
            </div>
        </header>
    )
}
