"use client"
import { useEffect, useState } from 'react'
import { NeonCard } from '@/components/ui/NeonCard'

export type CardWord = {
  id: string
  term: string
  meaning: string
  example?: string
  audioUrl?: string
}

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null

export default function WordCard({ words }: { words: CardWord[] }) {
  const [index, setIndex] = useState(0)
  const word = words[index]

  useEffect(() => () => synth?.cancel(), [index])

  const speak = () => {
    if (!word) return
    if (word.audioUrl) new Audio(word.audioUrl).play().catch(() => {})
    else if (synth) {
      const u = new SpeechSynthesisUtterance(word.term)
      u.lang = 'en-US'
      u.rate = 1
      synth.cancel(); synth.speak(u)
    }
  }

  return (
    <NeonCard className="p-6">
      {!word ? (
        <div className="text-white text-opacity-70">No words loaded.</div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-cyan-300">{word.term}</h2>
              <p className="mt-2 text-white text-opacity-80">{word.meaning}</p>
              {word.example && <p className="mt-2 text-white text-opacity-60 italic">{word.example}</p>}
            </div>
            <button onClick={speak} className="px-3 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-black">Speak</button>
          </div>
          <div className="mt-6 flex items-center justify-between text-white text-opacity-70">
            <button onClick={() => setIndex(i => Math.max(i - 1, 0))} className="hover:text-cyan-300">Prev</button>
            <div>{index + 1} / {words.length}</div>
            <button onClick={() => setIndex(i => Math.min(i + 1, words.length - 1))} className="hover:text-cyan-300">Next</button>
          </div>
        </>
      )}
    </NeonCard>
  )
}
