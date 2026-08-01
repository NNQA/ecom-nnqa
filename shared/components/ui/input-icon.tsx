import React from "react";
import { Input } from "./input";
import { cn } from "@/shared/lib/utils";

export interface InputCustomProps {
    icon: React.ReactNode;
}

export type InputCustomIconProps = React.ComponentProps<typeof Input> & InputCustomProps;
const InputCustomIcon = React.forwardRef<HTMLInputElement, InputCustomIconProps>(
    ({ className, icon, ...props }, ref) => {
        return (
            <div className="relative">
                <Input className={cn("pr-10", className)} ref={ref} {...props} />
                <div className="absolute right-0 top-0 h-full px-3 py-2">{icon}</div>
            </div>
        );
    }
);
InputCustomIcon.displayName = "InputCustomIcon";
export default InputCustomIcon;