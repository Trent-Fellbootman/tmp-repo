"use client"
import { useCallback } from 'react'
import { Volume2 } from 'lucide-react'
import { ReviewItem, review } from '@/lib/srs'

export default function WordCard({ item, onGrade }: { item: ReviewItem, onGrade: (updated: ReviewItem) => void }) {
  const speak = useCallback(() => {
    if (typeof window === 'undefined') return
    const synth = window.speechSynthesis
    if (!synth) return
    const utter = new SpeechSynthesisUtterance(item.word)
    utter.lang = 'en-US'
    synth.speak(utter)
  }, [item.word])

  const playAudio = () => {
    if (!item) return
    speak()
  }

  const grade = (q: 0|1|2|3|4|5) => {
    const updated = review(item, q)
    onGrade(updated)
  }

  return (
    <div className="cyber-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-cyan-300">{item.word}</h2>
        <button onClick={playAudio} className="p-2 rounded bg-white bg-opacity-[0.08] hover:bg-opacity-[0.15]">
          <Volume2 className="w-5 h-5" />
        </button>
      </div>
      <p className="mt-2 text-white text-opacity-80">{item.definition}</p>
      {item.example && <p className="mt-2 text-white text-opacity-60 italic">{item.example}</p>}

      <div className="mt-6 grid grid-cols-5 gap-2">
        {[0,1,2,3,4,5].map(q => (
          <button key={q} onClick={() => grade(q as 0|1|2|3|4|5)} className="px-2 py-2 rounded bg-cyan-600 bg-opacity-[0.3] hover:bg-opacity-[0.5]">
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}
