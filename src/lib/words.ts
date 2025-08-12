export type Word = {
  id: string
  word: string
  meaning: string
  example: string
  phonetic?: string
  deck?: string
}

export const seedWords: Word[] = [
  { id: 'w1', word: 'resilient', meaning: 'able to withstand or recover quickly from difficult conditions', example: 'A resilient mind adapts to change.', phonetic: '/rɪˈzɪliənt/', deck: 'core' },
  { id: 'w2', word: 'ubiquitous', meaning: 'present, appearing, or found everywhere', example: 'Smartphones are ubiquitous in modern society.', phonetic: '/juːˈbɪkwɪtəs/', deck: 'core' },
  { id: 'w3', word: 'meticulous', meaning: 'showing great attention to detail; very careful and precise', example: 'Meticulous planning leads to better results.', phonetic: '/məˈtɪkjʊləs/', deck: 'core' },
  { id: 'w4', word: 'ephemeral', meaning: 'lasting for a very short time', example: 'Fame is often ephemeral.', phonetic: '/ɪˈfɛmərəl/', deck: 'core' },
  { id: 'w5', word: 'synergy', meaning: 'the interaction that produces a combined effect greater than the sum', example: 'Team synergy accelerates progress.', phonetic: '/ˈsɪnərdʒi/', deck: 'core' }
]
