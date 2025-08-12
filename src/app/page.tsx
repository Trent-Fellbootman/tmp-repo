import Link from 'next/link'

export default function Home() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="card">
        <h2 className="text-xl mb-2">Learn Words</h2>
        <p className="text-white text-opacity-70 mb-3">Curated decks, SRS scheduling, examples, and TTS playback.</p>
        <Link className="btn" href="/learn">Go to Learn →</Link>
      </div>
      <div className="card">
        <h2 className="text-xl mb-2">Quiz</h2>
        <p className="text-white text-opacity-70 mb-3">Multiple choice, spelling, and listening modes with XP.</p>
        <Link className="btn" href="/quiz">Go to Quiz →</Link>
      </div>
      <div className="card">
        <h2 className="text-xl mb-2">Speak</h2>
        <p className="text-white text-opacity-70 mb-3">Practice pronunciation with speech recognition feedback.</p>
        <Link className="btn" href="/speak">Go to Speak →</Link>
      </div>
    </div>
  )
}
