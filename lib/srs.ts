export type ReviewItem = {
  id: string
  word: string
  definition: string
  example?: string
  ef: number // easiness factor
  interval: number // days
  reps: number
  due: number // timestamp
}

export function initItem(word: string, definition: string, example?: string): ReviewItem {
  return {
    id: word,
    word,
    definition,
    example,
    ef: 2.5,
    interval: 0,
    reps: 0,
    due: Date.now(),
  }
}

// Simplified SM-2
export function review(item: ReviewItem, quality: 0 | 1 | 2 | 3 | 4 | 5): ReviewItem {
  let { ef, interval, reps } = item
  if (quality < 3) {
    reps = 0
    interval = 1
  } else {
    if (reps === 0) interval = 1
    else if (reps === 1) interval = 6
    else interval = Math.round(interval * ef)
    reps += 1
  }
  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (ef < 1.3) ef = 1.3
  return {
    ...item,
    ef,
    interval,
    reps,
    due: Date.now() + interval * 24 * 60 * 60 * 1000,
  }
}

export function isDue(item: ReviewItem) {
  return item.due <= Date.now()
}
