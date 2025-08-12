import WordCard from './components/WordCard'

const defaultWords = [
  { id: '1', term: 'ubiquitous', meaning: 'present, appearing, or found everywhere', example: 'Smartphones are becoming ubiquitous in daily life.' },
  { id: '2', term: 'meticulous', meaning: 'showing great attention to detail; very careful and precise', example: 'She keeps meticulous records of her expenses.' },
  { id: '3', term: 'benevolent', meaning: 'well meaning and kindly', example: 'A benevolent leader cares for the well-being of others.' },
]

export default function LearnPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold text-cyan-300">Learn</h1>
      <WordCard words={defaultWords} />
    </div>
  )
}
