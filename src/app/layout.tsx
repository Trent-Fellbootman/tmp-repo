import '@/app/globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cyber English — Learn. Quiz. Speak.',
  description: 'A production-grade, cyberpunk-themed English learning app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-bg text-white">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 mix-blend-screen opacity-30" style={{background:
            'radial-gradient(circle at 10% 10%, rgba(0,229,255,0.15), transparent 35%),'+
            'radial-gradient(circle at 90% 20%, rgba(255,0,212,0.12), transparent 40%),'+
            'radial-gradient(circle at 20% 80%, rgba(0,255,163,0.1), transparent 40%)'
          }} />
        </div>
        <header className="sticky top-0 z-10 backdrop-blur bg-black bg-opacity-[0.35] border-b border-white border-opacity-10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-cyber text-xl tracking-widest animate-glow">CYBER ENGLISH</Link>
            <nav className="flex items-center gap-2">
              <Link className="nav-link" href="/learn">Learn</Link>
              <Link className="nav-link" href="/quiz">Quiz</Link>
              <Link className="nav-link" href="/speak">Speak</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="max-w-6xl mx-auto px-4 py-6 text-white text-opacity-60">
          <div className="flex justify-between items-center">
            <span>© {new Date().getFullYear()} Cyber English</span>
            <span className="text-xs">Built with Next.js • Neon UI</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
