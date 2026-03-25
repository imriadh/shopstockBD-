import * as React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'default', type = 'button', ...props },
  ref
) {
  const variantClass =
    variant === 'outline'
      ? 'border border-outline-variant/30 bg-surface-container-lowest text-on-surface hover:bg-surface-container'
      : variant === 'ghost'
      ? 'bg-transparent text-on-surface hover:bg-surface-container'
      : 'bg-primary text-on-primary hover:bg-primary/90'

  return (
    <button
      ref={ref}
      type={type}
      className={[
        'inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold transition active:scale-[0.99]',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
})
