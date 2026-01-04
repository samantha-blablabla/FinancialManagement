import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
          {
            'bg-stone-800 text-stone-200': variant === 'default',
            'bg-success/10 text-success border border-success/20':
              variant === 'success',
            'bg-warning/10 text-warning border border-warning/20':
              variant === 'warning',
            'bg-error/10 text-error border border-error/20': variant === 'error',
            'bg-info/10 text-info border border-info/20': variant === 'info',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
