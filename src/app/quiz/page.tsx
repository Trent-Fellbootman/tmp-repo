"use client"
import { useMemo, useState } from 'react'
import { seedWords } from '@/lib/words'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function QuizPage() {
  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const [mode, setMode] = useState<'choice'|'spell'|'listen'>('choice')
  const words = useMemo(() => shuffle(seedWords).slice(0, 8), [])
  const w = words[i % words.length]

  const options = useMemo(() => shuffle([w.meaning, ...shuffle(words).filter(x => x.id !== w.id).slice(0,3).map(x => x.meaning)]), [i])

  const speak = () => {
    const u = new SpeechSynthesisUtterance(w.word)
    u.lang = 'en-US'
    window.speechSynthesis.speak(u)
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <button className={`btn ${mode==='choice' ? 'bg-cyan-500 bg-opacity-20' : ''}`} onClick={() => setMode('choice')}>Choice</button>
        <button className={`btn ${mode==='spell' ? 'bg-cyan-500 bg-opacity-20' : ''}`} onClick={() => setMode('spell')}>Spelling</button>
        <button className={`btn ${mode==='listen' ? 'bg-cyan-500 bg-opacity-20' : ''}`} onClick={() => setMode('listen')}>Listening</button>
        <div className="ml-auto text-white text-opacity-70">Score: {score}</div>
      </div>

      {mode === 'choice' && (
        <div>
          <div className="text-2xl font-cyber mb-4">{w.word}</div>
          <div className="grid md:grid-cols-2 gap-2">
            {options.map((opt, idx) => (
              <button key={idx} className="btn text-left" onClick={() => {
                if (opt === w.meaning) setScore(s => s + 1)
                setI(n => n + 1)
              }}>{opt}</button>
            ))}
          </div>
        </div>
      )}

      {mode === 'spell' && (
        <Spell word={w.word} onCorrect={() => setScore(s=>s+1)} onNext={() => setI(n=>n+1)} />
      )}

      {mode === 'listen' && (
        <div>
          <div className="mb-3">Click to listen, then choose the correct meaning.</div>
          <button className="btn mb-4" onClick={speak}>🔊 Play</button>
          <div className="grid md:grid-cols-2 gap-2">
            {options.map((opt, idx) => (
              <button key={idx} className="btn text-left" onClick={() => {
                if (opt === w.meaning) setScore(s => s + 1)
                setI(n => n + 1)
              }}>{opt}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Spell({ word, onCorrect, onNext }: { word: string, onCorrect: () => void, onNext: () => void }) {
  const [input, setInput] = useState('')
  const check = () => {
    if (input.trim().toLowerCase() === word.toLowerCase()) {
      onCorrect()
      onNext()
      setInput('')
    }
  }
  return (
    <div>
      <div className="text-white text-opacity-70 mb-2">Type the word:</div>
      <div className="text-2xl font-cyber mb-3">{word.replace(/./g, '•')}</div>
      <input className="w-full bg-black bg-opacity-[0.4] border border-white border-opacity-10 rounded px-3 py-2 mb-3" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=> e.key==='Enter' && check()} />
      <button className="btn" onClick={check}>Check</button>
    </div>
  )
}
