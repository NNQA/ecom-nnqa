
import Logo from './logo'
import Link from 'next/link'
import { IconBrandInstagram, IconBrandLinkedin, IconBrandTailwind } from '@tabler/icons-react'

function Footer() {
    return (
        <footer className='border-t border-border bg-background'>
            <div className='mx-auto max-w-7xl px-4 py-12'>
                <div className='grid md:grid-cols-4 grid-cols-1 gap-8'>
                    <div className='space-y-3'>
                        <Logo size='lg' showText />
                        <p className='text-sm text-muted-foreground leading-relaxed'>
                            Curated selection of high-quality products, handpicked for you. Discover unique finds and elevate your shopping experience with us.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Legal</h4>
                        <ul className="space-y-2.5">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground underline"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground underline"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Customer Care</h4>
                        <ul className="space-y-2.5">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Shipping
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Returns
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Social</h4>
                        <div className="flex items-center gap-4">
                            <Link
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                                title="Instagram"
                            >
                                <IconBrandInstagram className='h-7 w-7' />
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                                title="Twitter"
                            >
                                <IconBrandLinkedin className='h-7 w-7' />
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                                title="Twitter"
                            >
                                <IconBrandTailwind className='h-7 w-7' />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-border/50 bg-background px-4 py-6">
                <div className="mx-auto max-w-7xl text-center text-xs text-muted-foreground">
                    © 2024 NNQA Store. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer