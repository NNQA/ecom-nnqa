import React from 'react'
import { Card, CardContent } from './ui/card'
import { IconExclamationCircle } from '@tabler/icons-react'
import { cn } from '@/lib/utils';

interface BoxAlertProps {
    message?: string;
    className?: string
}
function BoxAlert({ message, className }: BoxAlertProps) {
    return (
        <Card className='p-0 border-destructive bg-destructive/10 ring-destructive'>
            <CardContent className='p-0'>
                <div className={cn("flex gap-4 px-2 py-3", className)}>
                    <IconExclamationCircle className='w-7 h-7 pb-1 text-destructive' />
                    <p className='text-base font-bold text-destructive/75'>{message || "An error occurred. Please try again."}</p>
                </div>
            </CardContent>
        </Card>
    )
}

export default BoxAlert