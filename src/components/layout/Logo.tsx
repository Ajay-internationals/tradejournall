import { cn } from '@/lib/utils';

export function Logo({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="relative w-10 h-10 flex items-center justify-center">
                {/* Custom Branded Logo - Copyright Free Lightning/Zap Type */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect
                        x="10"
                        y="10"
                        width="80"
                        height="80"
                        rx="24"
                        className="fill-indigo-700"
                    />
                    {/* Custom Lightning Bolt Path - Unique design */}
                    <path
                        d="M55,25 L35,55 L50,55 L45,75 L65,45 L50,45 L55,25 Z"
                        fill="white"
                        className="drop-shadow-sm"
                    />
                </svg>
            </div>
            {!iconOnly && (
                <span className="text-xl font-black tracking-tight text-[var(--app-text)] group-hover:text-indigo-600 transition-colors">
                    Trade Adhyayan
                </span>
            )}
        </div>
    );
}
