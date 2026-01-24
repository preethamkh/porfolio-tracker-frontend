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
        <div className={`bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-md ${className || ''}`}>
            <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                    <h3 className="font-semibold text-red-700 mb-2">{title}</h3>
                    <p className="text-sm text-red-600 mb-4">{message}</p>
                    {onRetry && (
                        <Button variant="outline" size="sm" onClick={onRetry} className="border-red-300 text-red-700 hover:bg-red-50">
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-teal-50 p-4">
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