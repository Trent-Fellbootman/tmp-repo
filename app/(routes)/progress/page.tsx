"use client"
import { useEffect, useMemo, useState } from 'react'
import { NeonCard } from '@/components/ui/NeonCard'

export default function ProgressPage() {
  const [stats, setStats] = useState({ learned: 0, due: 0 })

  useEffect(() => {
    // placeholder local stats; can be replaced by API later
    const learned = Number(localStorage.getItem('learned') || '0')
    const due = Number(localStorage.getItem('due') || '0')
    setStats({ learned, due })
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-cyan-300">Progress</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        <NeonCard className="p-6">
          <div className="text-white text-opacity-70">Words Learned</div>
          <div className="text-4xl font-extrabold text-cyan-300 mt-2">{stats.learned}</div>
        </NeonCard>
        <NeonCard className="p-6">
          <div className="text-white text-opacity-70">Due for Review</div>
          <div className="text-4xl font-extrabold text-pink-300 mt-2">{stats.due}</div>
        </NeonCard>
      </div>
    </div>
  )
}
