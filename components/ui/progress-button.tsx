import { cn } from "@/lib/utils";
import { Button } from "./button";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
interface ProgressButtonLoadingProps extends React.ComponentPropsWithoutRef<typeof Button> {
    mainText?: string;
    state?: boolean;
    loadingText?: string;
}

function ProgressButtonLoading({ state = false, mainText, className, loadingText, ...props }: ProgressButtonLoadingProps) {
    return (
        <Button
            className={cn("relative", className)}
            disabled={state}
            {...props}
        >
            <span
                className={clsx("block transition ease-in-out font-bold", {
                    "opacity-0": state,
                    "scale-0": state,
                })}
            >
                {mainText ? mainText : "Submit"}
            </span>
            <AnimatePresence>
                {state && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            ease: "easeInOut",
                            duration: 0.3,
                        }} className="w-[50%] h-[50%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S1.486 17.514 1 12 5.486 2 12 2zm0 18c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zm1-11h-2v4h2v-4zm-2 5h2v2h-2v-2z"
                                />
                            </svg>
                            {loadingText ? loadingText : "Loading..."}
                        </div>
                    </motion.div>)}
            </AnimatePresence>
        </Button>
    )
}

export default ProgressButtonLoading