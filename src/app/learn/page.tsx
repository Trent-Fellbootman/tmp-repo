"use client"
import { useMemo, useState } from 'react'
import { seedWords, type Word } from '@/lib/words'
import { bumpSeen, loadProgress, saveProgress, updateCorrectness } from '@/lib/storage'

export default function LearnPage() {
  const [progress, setProgress] = useState(loadProgress())
  const [index, setIndex] = useState(0)
  const word = useMemo(() => seedWords[index % seedWords.length], [index])

  const onNext = () => {
    const p = { ...progress, seen: { ...progress.seen }, correctness: { ...progress.correctness } }
    bumpSeen(p, word.id)
    saveProgress(p)
    setProgress(p)
    setIndex(i => i + 1)
  }

  const speak = () => {
    if (typeof window === 'undefined') return
    const synth = window.speechSynthesis
    const u = new SpeechSynthesisUtterance(word.word)
    u.rate = 1
    u.pitch = 1
    synth.speak(u)
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card">
        <div className="text-sm text-white text-opacity-60 mb-2">Deck: {word.deck || 'core'}</div>
        <h1 className="text-3xl mb-2 font-cyber">{word.word}</h1>
        {word.phonetic && <div className="text-white text-opacity-70 mb-3">{word.phonetic}</div>}
        <p className="mb-3">{word.meaning}</p>
        <p className="text-white text-opacity-70">Example: {word.example}</p>
        <div className="mt-4 flex gap-2">
          <button className="btn" onClick={speak}>🔊 Speak</button>
          <button className="btn" onClick={onNext}>Next →</button>
        </div>
      </div>
      <div className="card">
        <h2 className="text-xl mb-2">Your Progress</h2>
        <div className="text-sm text-white text-opacity-70">
          Seen: {Object.keys(progress.seen).length} words
        </div>
        <div className="text-sm text-white text-opacity-70">
          Mastery: {Object.values(progress.correctness).reduce((a,b)=>a+b,0)}
        </div>
      </div>
    </div>
  )
}
