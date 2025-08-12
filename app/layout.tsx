import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cyber English — Learn Like a Hacker',
  description: 'A cyberpunk-themed English learning app with SRS, quizzes and TTS.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-black text-white`}>
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-fuchsia-500/10" />
        </div>
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-black bg-opacity-[0.35] border-b border-white border-opacity-10">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-cyan-300 font-semibold tracking-wider">CYBER ENGLISH</Link>
            <nav className="flex gap-6 text-white text-opacity-70">
              <Link href="/learn" className="hover:text-cyan-300 transition">Learn</Link>
              <Link href="/quiz" className="hover:text-cyan-300 transition">Quiz</Link>
              <Link href="/progress" className="hover:text-cyan-300 transition">Progress</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
