"use client"

export function VisualPanel() {
  return (
    <div className="animate-fade-in hidden flex-col items-center justify-center bg-linear-to-r from-muted to-muted/50 p-20 md:flex md:w-2/3">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-6 text-center">
          <h1 className="animate-float text-4xl font-bold text-foreground">
            NNQA Store
          </h1>
          <p className="text-2xl font-light text-foreground/80">
            Simple. Modern. Everything.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Curated selection of high-end digital assets and physical goods for
            the modern minimalist
          </p>
        </div>

        <div className="space-y-4">
          <div className="h-px bg-linear-to-r from-transparent via-border to-transparent"></div>
          <div className="space-y-3 pt-4">
            <div className="flex items-start gap-3">
              <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></div>
              <p className="text-sm text-foreground/70">
                Premium digital & physical products
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></div>
              <p className="text-sm text-foreground/70">
                Handpicked from global creators
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"></div>
              <p className="text-sm text-foreground/70">
                Secure checkout & fast delivery
              </p>
            </div>
          </div>

          <div className="h-px bg-linear-to-r from-transparent via-border to-transparent pt-4"></div>
        </div>

        <div className="rounded-lg border border-border bg-background/50 p-4 backdrop-blur">
          <div className="space-y-4">
            <div className="aspect-square h-64 animate-pulse rounded-lg bg-linear-to-br from-border to-muted"></div>
            <div className="space-y-2">
              <div className="h-2 w-3/4 animate-pulse rounded bg-border"></div>
              <div className="h-1 w-1/2 animate-pulse rounded bg-border"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
