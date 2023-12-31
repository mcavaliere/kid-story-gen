import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { createElement } from 'react';

const baseStyles = '';

const variantStyles = {
  size: {
    h1: 'text-4xl',
    h2: 'text-3xl',
    h3: 'text-2xl',
    h4: 'text-xl',
    h5: 'text-lg',
    h6: 'text-md',
  },
};

export const headingVariants = cva(baseStyles, {
  variants: variantStyles,
  defaultVariants: {
    size: 'h1',
  },
});

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & {
    tagName?: keyof JSX.IntrinsicElements;
  };

export function Heading({
  children,
  className = '',
  size = 'h1',
  tagName = 'h1',
  ...rest
}: HeadingProps) {
  const classNames = cn(headingVariants({ size, className }));

  return createElement(tagName, { className: classNames, ...rest }, children);
}

// export function H1({ children, className,  variant }: H1Props) {
//   return (
//     <h1
//       className={cn(headingVariants({ element: tagName, variant, className }))}
//     >
//       {children}
//     </h1>
//   );
// }
