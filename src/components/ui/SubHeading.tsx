import { cn } from '@/lib/utils';

interface SubHeadingProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'simple' | 'performance';
}

export function SubHeading({ children, className, variant = 'simple' }: SubHeadingProps) {
    if (variant === 'performance') {
        return (
            <p className={cn(
                "text-[10px] font-black uppercase tracking-[0.8em] text-slate-400 mb-6 italic leading-none whitespace-nowrap",
                className
            )}>
                {children}
            </p>
        );
    }

    return (
        <p className={cn(
            "text-[10px] font-bold text-slate-400 mb-6 leading-none",
            className
        )}>
            {children}
        </p>
    );
}
