import { ReactNode } from 'react'
import classNames from 'classnames'

export function NeonCard({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={classNames('cyber-card border border-white border-opacity-10 rounded-xl', 'hover:shadow-neon transition', className)}>
      {children}
    </div>
  )
}
