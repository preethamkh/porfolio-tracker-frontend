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
            className={`text-center py-12 px-4 border-2 border-dashed border-border rounded-lg bg-muted/20 ${className || ''
                }`}
        >
            {icon && <div className="mb-4 flex justify-center text-muted-foreground">{icon}</div>}

            <h3 className="text-lg font-semibold mb-2">{title}</h3>

            {description && (
                <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                    {description}
                </p>
            )}

            {action && (
                <Button onClick={action.onClick} variant="default">
                    {action.label}
                </Button>
            )}
        </div>
    );
}