'use client';

export function VisualPanel() {
    return (
        <div className="hidden md:flex md:w-2/3 flex-col items-center justify-center bg-linear-to-r from-muted to-muted/50 p-20 animate-fade-in">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl font-bold text-foreground animate-float">
                        NNQA Store
                    </h1>
                    <p className="text-2xl font-light text-foreground/80">
                        Simple. Modern. Everything.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Curated selection of high-end digital assets and physical goods for the modern minimalist
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="h-px bg-linear-to-r from-transparent via-border to-transparent"></div>
                    <div className="space-y-3 pt-4">
                        <div className="flex items-start gap-3">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                            <p className="text-sm text-foreground/70">Premium digital & physical products</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                            <p className="text-sm text-foreground/70">Handpicked from global creators</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                            <p className="text-sm text-foreground/70">Secure checkout & fast delivery</p>
                        </div>
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-border to-transparent pt-4"></div>
                </div>

                <div className="rounded-lg border border-border bg-background/50 backdrop-blur p-4">
                    <div className="space-y-4">
                        <div className="h-64 aspect-square rounded-lg bg-linear-to-br from-border to-muted animate-pulse"></div>
                        <div className="space-y-2">
                            <div className="h-2 bg-border rounded w-3/4 animate-pulse"></div>
                            <div className="h-1 bg-border rounded w-1/2 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
