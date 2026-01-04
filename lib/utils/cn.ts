import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with clsx
 * Helps avoid class conflicts and maintains proper specificity
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
