import { cn } from '@/lib/utils'
import { IconDiamond } from '@tabler/icons-react'


interface LogoProps {
    className?: string,
    size?: 'sm' | 'md' | 'lg'
    showText?: boolean
}
function Logo({ size = 'md', showText, className }: LogoProps) {
    const sizeClasses = {
        sm: {
            container: 'gap-1.5',
            icon: 'h-5 w-5',
            iconSize: "size-3",
            text: "text-sm"
        },
        md: {
            container: "gap-2",
            icon: "h-6 w-6",
            iconSize: "size-4",
            text: "text-base",
        },
        lg: {
            container: "gap-3",
            icon: "h-8 w-8",
            iconSize: "size-5",
            text: "text-lg",
        },
    }
    const currentSize = sizeClasses[size]
    return (
        <div
            className={cn("flex items-center self-center font-medium transition-all duration-200 hover:scale-105 cursor-pointer group", currentSize.container, className)}
        >
            <div
                className={cn("flex items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:scale-110",
                    currentSize.icon)}>
                <IconDiamond className={cn("transition-transform group-hover:rotate-3 animate-pulse", currentSize.iconSize)} />
            </div>
            {showText && (
                <span
                    className={cn(
                        "font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary",
                        currentSize.text,
                    )}
                >
                    NNQA Store
                </span>
            )}

        </div>
    )
}

export default Logo