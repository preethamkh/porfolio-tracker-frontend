/**
 * Empty State Component
 * 
 * Shows when there's no data to display.
 */

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={`text-center py-12 px-4 border-2 border-dashed border-teal-200 rounded-2xl bg-gradient-to-br from-white via-teal-50 to-blue-50 shadow-sm ${className || ''
                }`}
        >
            {icon && <div className="mb-4 flex justify-center text-teal-600">{icon}</div>}

            <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>

            {description && (
                <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                    {description}
                </p>
            )}

            {action && (
                <Button onClick={action.onClick} variant="default" className="bg-teal-600 hover:bg-teal-700 text-white">
                    {action.label}
                </Button>
            )}
        </div>
    );
}