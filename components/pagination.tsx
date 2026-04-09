'use client';

import { IconGlobe, IconHeart, IconSearch, IconShoppingCart } from '@tabler/icons-react';
import Link from 'next/link';
import Logo from './ui/logo';

export function Pagination() {
    return (
        <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="border-b border-border/50 bg-background">
                <div className="mx-auto max-w-7xl px-4 py-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                            <Link href="#" className="transition-colors hover:text-foreground">
                                Seller Center
                            </Link>
                            <Link href="#" className="transition-colors hover:text-foreground">
                                Become a Seller
                            </Link>
                            <Link href="#" className="transition-colors hover:text-foreground">
                                Download App
                            </Link>
                            <div className="flex gap-3">
                                <Link href="#" className="transition-colors hover:text-foreground">
                                    f
                                </Link>
                                <Link href="#" className="transition-colors hover:text-foreground">
                                    ⓘ
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="transition-colors hover:text-foreground">
                                Notifications
                            </Link>
                            <Link href="#" className="transition-colors hover:text-foreground">
                                Help
                            </Link>
                            <button className="flex items-center gap-1 transition-colors hover:text-foreground">
                                <IconGlobe className="h-3.5 w-3.5" />
                                <span>EN</span>
                            </button>
                            <Link href="#" className="transition-colors hover:text-foreground">
                                Sign Up
                            </Link>
                            <Link href="#" className="font-medium text-foreground transition-colors hover:text-primary">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-3">
                <div className="flex items-center gap-8">
                    <div className="shrink-0">
                        <Logo size="lg" showText={true} />
                    </div>

                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <IconSearch className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="transition-colors duration-200 hover:text-primary">
                            <IconHeart className="h-5 w-5" />
                        </button>
                        <button className="relative transition-colors duration-200 hover:text-primary">
                            <IconShoppingCart className="h-5 w-5" />
                            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                                0
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
