import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface CategoryIconProps extends Omit<LucideProps, 'ref'> {
  name: string;
}

export function CategoryIcon({ name, ...props }: CategoryIconProps) {
  // @ts-ignore - Dynamic icon access
  const IconComponent = Icons[name as keyof typeof Icons];

  if (!IconComponent) {
    // Fallback to Wallet icon if icon name not found
    return <Icons.Wallet {...props} />;
  }

  return <IconComponent {...props} />;
}
