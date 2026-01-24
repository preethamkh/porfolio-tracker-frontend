/**
 * Error Display Component
 * 
 * Shows error messages with optional retry action.
 */

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorDisplay({
    title = 'Something went wrong',
    message,
    onRetry,
    className
}: ErrorDisplayProps) {
    return (
        <div className={`bg-destructive/10 border border-destructive rounded-lg p-6 ${className || ''}`}>
            <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                <div className="flex-1">
                    <h3 className="font-semibold text-destructive mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{message}</p>
                    {onRetry && (
                        <Button variant="outline" size="sm" onClick={onRetry}>
                            Try Again
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Full Page Error State
 */
export function ErrorPage({
    title,
    message,
    onRetry
}: ErrorDisplayProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <ErrorDisplay
                    title={title}
                    message={message}
                    onRetry={onRetry}
                />
            </div>
        </div>
    );
}