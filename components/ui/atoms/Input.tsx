import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border bg-stone-950 px-3 py-2 text-sm',
          'border-stone-800 text-stone-100 placeholder:text-stone-500',
          'focus:outline-none focus:ring-2 focus:ring-stone-600 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors',
          error && 'border-error focus:ring-error',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
