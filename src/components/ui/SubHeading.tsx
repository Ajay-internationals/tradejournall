import { cn } from '@/lib/utils';

interface SubHeadingProps {
    children: React.ReactNode;
    className?: string;
}

export function SubHeading({ children, className }: SubHeadingProps) {
    return (
        <p className={cn(
            "text-[10px] font-bold text-slate-400 mb-6 leading-none",
            className
        )}>
            {children}
        </p>
    );
}
