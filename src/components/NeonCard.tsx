import { ReactNode } from 'react'

export function NeonCard({ title, children }: { title?: string, children: ReactNode }) {
  return (
    <div className="card">
      {title && <h2 className="text-xl mb-2">{title}</h2>}
      {children}
    </div>
  )
}
