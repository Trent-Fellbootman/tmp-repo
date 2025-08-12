"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { seedWords } from '@/lib/words'

export default function SpeakPage() {
  const [i, setI] = useState(0)
  const word = useMemo(() => seedWords[i % seedWords.length], [i])
  const [transcript, setTranscript] = useState('')
  const [score, setScore] = useState<number|null>(null)
  const recRef = useRef<any>(null)

  const speak = () => {
    const u = new SpeechSynthesisUtterance(word.word)
    u.lang = 'en-US'
    u.rate = 1
    window.speechSynthesis.speak(u)
  }

  const startRec = () => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SR) {
      alert('SpeechRecognition not supported in this browser')
      return
    }
    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript as string
      setTranscript(text)
      const s = similarity(text.toLowerCase(), word.word.toLowerCase())
      setScore(Math.round(s * 100))
    }
    rec.onerror = () => {}
    rec.onend = () => {}
    rec.start()
    recRef.current = rec
  }

  useEffect(() => () => { try { recRef.current?.stop() } catch {} }, [])

  return (
    <div className="space-y-4">
      <div className="card">
        <h1 className="text-xl mb-2">Pronunciation Practice</h1>
        <div className="text-3xl font-cyber mb-2">{word.word}</div>
        <div className="text-white text-opacity-70">Try to pronounce the word. We will score similarity.</div>
        <div className="mt-4 flex gap-2">
          <button className="btn" onClick={speak}>🔊 Hear</button>
          <button className="btn" onClick={startRec}>🎙️ Record</button>
          <button className="btn" onClick={() => setI(n => n + 1)}>Next →</button>
        </div>
      </div>
      <div className="card">
        <div className="text-sm text-white text-opacity-70">Transcript</div>
        <div className="mt-1 text-lg">{transcript || '...'}</div>
        <div className="mt-3 text-sm text-white text-opacity-70">Score</div>
        <div className="text-3xl font-cyber">{score ?? '--'}%</div>
      </div>
    </div>
  )
}

function similarity(a: string, b: string) {
  // simple normalized Levenshtein-like ratio
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0))
  for (let i = 0; i <= a.length; i++) dp[i][0] = i
  for (let j = 0; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      )
    }
  }
  const dist = dp[a.length][b.length]
  const maxLen = Math.max(a.length, b.length) || 1
  return 1 - dist / maxLen
}
