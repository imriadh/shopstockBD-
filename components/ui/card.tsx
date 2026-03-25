import * as React from 'react'

type DivProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={[
        'rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/95 text-on-surface shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={['space-y-1.5 p-6 pb-3', className].filter(Boolean).join(' ')} {...props} />
}

export function CardTitle({ className, ...props }: DivProps) {
  return <div className={['font-headline text-2xl font-extrabold tracking-tight', className].filter(Boolean).join(' ')} {...props} />
}

export function CardDescription({ className, ...props }: DivProps) {
  return <div className={['text-sm text-on-surface-variant', className].filter(Boolean).join(' ')} {...props} />
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={['p-6 pt-0', className].filter(Boolean).join(' ')} {...props} />
}

export function CardFooter({ className, ...props }: DivProps) {
  return <div className={['flex items-center p-6 pt-0', className].filter(Boolean).join(' ')} {...props} />
}
