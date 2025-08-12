export type StoredProgress = {
  seen: Record<string, number> // wordId -> times reviewed
  correctness: Record<string, number> // wordId -> streak or score
}

const KEY = 'cyber-english-progress-v1'

export function loadProgress(): StoredProgress {
  if (typeof window === 'undefined') return { seen: {}, correctness: {} }
  try {
    const s = window.localStorage.getItem(KEY)
    if (!s) return { seen: {}, correctness: {} }
    return JSON.parse(s) as StoredProgress
  } catch {
    return { seen: {}, correctness: {} }
  }
}

export function saveProgress(p: StoredProgress) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(p))
}

export function bumpSeen(p: StoredProgress, id: string) {
  p.seen[id] = (p.seen[id] || 0) + 1
}

export function updateCorrectness(p: StoredProgress, id: string, delta: number) {
  p.correctness[id] = Math.max(0, (p.correctness[id] || 0) + delta)
}
