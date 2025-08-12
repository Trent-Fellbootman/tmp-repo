import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="grid gap-8">
      <section className="text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          <span className="text-cyan-300">Cyber</span>
          <span className="text-white"> English</span>
        </h1>
        <p className="mt-4 text-white text-opacity-70 max-w-2xl mx-auto">
          Learn English like a cyber runner. Neon-flavored flashcards, adaptive quizzes, and immersive TTS.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/learn" className="px-5 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition shadow-neon">Start Learning</Link>
          <Link href="/quiz" className="px-5 py-3 rounded-lg bg-fuchsia-700 hover:bg-fuchsia-600 transition">Take a Quiz</Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Learn', href: '/learn', desc: 'Flashcards with audio and examples.' },
          { title: 'Quiz', href: '/quiz', desc: 'MCQ, spelling, and listening drills.' },
          { title: 'Progress', href: '/progress', desc: 'SRS schedule and stats.' },
        ].map(card => (
          <Link key={card.title} href={card.href} className="cyber-card p-6 hover:bg-white hover:bg-opacity-[0.06] transition">
            <h3 className="text-xl font-semibold text-cyan-300">{card.title}</h3>
            <p className="text-white text-opacity-70 mt-2">{card.desc}</p>
          </Link>
        ))}
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-white border-opacity-10">
        <Image src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1800&auto=format&fit=crop" alt="cyber city" width={1600} height={600} className="w-full h-64 md:h-80 object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black to-transparent" />
        <div className="absolute left-6 bottom-6">
          <p className="text-white text-opacity-70">Built with Next.js, Tailwind, and love for neon.</p>
        </div>
      </section>
    </div>
  )
}
