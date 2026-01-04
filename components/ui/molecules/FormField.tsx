import { forwardRef } from 'react';
import { Label } from '../atoms/Label';
import { Input, InputProps } from '../atoms/Input';
import { cn } from '@/lib/utils/cn';

export interface FormFieldProps extends InputProps {
  label: string;
  error?: string;
  helperText?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, className, required, id, ...props }, ref) => {
    const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={cn('space-y-2', className)}>
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
        <Input
          id={inputId}
          ref={ref}
          error={error}
          {...props}
        />
        {error && (
          <p className="text-sm text-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-stone-500">{helperText}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export { FormField };
