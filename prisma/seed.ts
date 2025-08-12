import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const words = [
  { term: 'ubiquitous', meaning: 'present, found everywhere', example: 'Smartphones are ubiquitous nowadays.' },
  { term: 'meticulous', meaning: 'very careful and precise', example: 'She is meticulous in her work.' },
  { term: 'benevolent', meaning: 'well meaning and kindly', example: 'A benevolent leader cares for the team.' },
  { term: 'concise', meaning: 'giving much information clearly and in a few words' },
]

async function main() {
  for (const w of words) {
    await prisma.word.upsert({
      where: { term: w.term },
      update: {},
      create: w,
    })
  }
  console.log('Seeded words:', words.length)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
