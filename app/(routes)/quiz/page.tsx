"use client"
import { useMemo, useState } from 'react'
import { NeonCard } from '@/components/ui/NeonCard'

const WORDS = [
  { term: 'ubiquitous', meaning: 'found everywhere' },
  { term: 'meticulous', meaning: 'very careful and precise' },
  { term: 'benevolent', meaning: 'well meaning and kindly' },
  { term: 'serendipity', meaning: 'finding valuable things not sought' },
]

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function QuizPage() {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)

  const q = useMemo(() => {
    const word = WORDS[index]
    const choices = shuffle([
      word.meaning,
      ...shuffle(WORDS.filter(w => w.term !== word.term)).slice(0, 3).map(w => w.meaning)
    ])
    return { word: word.term, answer: word.meaning, choices }
  }, [index])

  const choose = (m: string) => {
    if (m === q.answer) setScore(s => s + 1)
    setIndex(i => (i + 1) % WORDS.length)
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold text-cyan-300">Quiz</h1>
      <NeonCard className="p-6">
        <p className="text-white text-opacity-70">What does this word mean?</p>
        <h2 className="mt-2 text-3xl font-extrabold text-cyan-300">{q.word}</h2>
        <div className="mt-6 grid gap-3">
          {q.choices.map(c => (
            <button key={c} onClick={() => choose(c)} className="text-left p-3 rounded bg-white bg-opacity-[0.06] hover:bg-opacity-[0.12]">
              {c}
            </button>
          ))}
        </div>
        <div className="mt-6 text-white text-opacity-70">Score: {score}</div>
      </NeonCard>
    </div>
  )
}
