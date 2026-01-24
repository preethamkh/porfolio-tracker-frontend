/**
 * Loading Spinner Component
 * 
 * Reusable loading indicator for async operations.
 */

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    message?: string;
}

const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
};

export function LoadingSpinner({
    size = 'md',
    className,
    message
}: LoadingSpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div
                className={cn(
                    'border-teal-600 border-t-transparent rounded-full animate-spin',
                    sizeClasses[size],
                    className
                )}
            />
            {message && (
                <p className="text-sm text-gray-600">{message}</p>
            )}
        </div>
    );
}

/**
 * Full Page Loading State
 */
export function LoadingPage({ message = 'Loading...' }: { message?: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-teal-50">
            <div className="bg-white border border-teal-300 rounded-2xl p-12 shadow-xl">
                <LoadingSpinner size="lg" message={message} />
            </div>
        </div>
    );
}