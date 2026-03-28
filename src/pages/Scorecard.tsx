import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, ChevronDown, Check, Minus, Plus, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { courses } from '../data'

export default function Scorecard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [courseId, setCourseId] = useState(courses[0].id)
  const course = courses.find(c => c.id === courseId)!
  const [scores, setScores] = useState<(number | null)[]>(Array(18).fill(null))
  const [showCourseSelect, setShowCourseSelect] = useState(false)
  const [activeHole, setActiveHole] = useState<number | null>(null)
  const [lastScored, setLastScored] = useState<number | null>(null)

  const setScore = (hole: number, score: number) => {
    const next = [...scores]
    next[hole] = score
    setScores(next)
    setLastScored(hole)

    const diff = score - course.holes[hole].par
    if (score === 1) toast('🏆 HOLE IN ONE!!!', { duration: 4000 })
    else if (diff <= -2) toast('🦅 Eagle!', { duration: 2500 })
    else if (diff === -1) toast('🐦 Birdie!', { duration: 2000 })
  }

  const adjustScore = (hole: number, delta: number) => {
    const current = scores[hole] ?? course.holes[hole].par
    const newScore = Math.max(1, Math.min(12, current + delta))
    setScore(hole, newScore)
  }

  const totalScore = scores.reduce<number>((sum, s) => sum + (s || 0), 0)
  const holesPlayed = scores.filter(s => s !== null).length
  const totalPar = holesPlayed > 0
    ? scores.reduce<number>((s, v, i) => v !== null ? s + course.holes[i].par : s, 0)
    : 0
  const toPar = holesPlayed > 0 ? totalScore - totalPar : 0

  const frontNine = course.holes.slice(0, 9)
  const backNine = course.holes.slice(9)
  const frontScore = scores.slice(0, 9).reduce<number>((s, v) => s + (v || 0), 0)
  const backScore = scores.slice(9).reduce<number>((s, v) => s + (v || 0), 0)
  const frontPar = frontNine.reduce((s, h) => s + h.par, 0)
  const backPar = backNine.reduce((s, h) => s + h.par, 0)

  const getScoreStyle = (score: number | null, par: number) => {
    if (score === null) return { bg: '', ring: '', text: '' }
    const diff = score - par
    if (diff <= -2) return { bg: 'bg-amber-500', ring: 'ring-2 ring-amber-400/50', text: 'text-white' }
    if (diff === -1) return { bg: 'bg-emerald-500', ring: 'ring-2 ring-emerald-400/50', text: 'text-white' }
    if (diff === 0) return { bg: 'bg-white/10', ring: '', text: 'text-white' }
    if (diff === 1) return { bg: 'bg-blue-500/60', ring: '', text: 'text-white' }
    return { bg: 'bg-red-500/60', ring: '', text: 'text-white' }
  }

  const getScoreLabel = (score: number | null, par: number) => {
    if (score === null) return '–'
    const diff = score - par
    if (score === 1) return 'Ace!'
    if (diff <= -2) return 'Eagle'
    if (diff === -1) return 'Birdie'
    if (diff === 0) return 'Par'
    if (diff === 1) return 'Bogey'
    if (diff === 2) return 'Double'
    return `+${diff}`
  }

  const reset = () => {
    setScores(Array(18).fill(null))
    setActiveHole(null)
    setLastScored(null)
    toast('Scorecard cleared 🔄')
  }

  // Progress
  const progress = (holesPlayed / 18) * 100

  const renderHole = (hole: typeof course.holes[0], idx: number) => {
    const score = scores[idx]
    const style = getScoreStyle(score, hole.par)
    const isActive = activeHole === idx
    const wasJustScored = lastScored === idx

    return (
      <motion.div
        key={hole.number}
        layout
        className={`rounded-2xl overflow-hidden transition-all ${
          isActive ? 'glass-emerald' : 'glass'
        }`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: (idx % 9) * 0.025 }}
      >
        <button
          onClick={() => setActiveHole(isActive ? null : idx)}
          className="w-full p-3.5 flex items-center gap-3"
        >
          {/* Hole number */}
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
            hole.par === 3 ? 'bg-blue-500/10 text-blue-400' :
            hole.par === 5 ? 'bg-amber-500/10 text-amber-400' :
            'bg-white/5 text-white/60'
          }`}>
            {hole.number}
          </div>

          {/* Hole info */}
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-white/50">Par {hole.par}</span>
              <span className="text-[10px] text-white/20">{hole.distance}m</span>
            </div>
            {score !== null && (
              <p className="text-[10px] text-white/30 mt-0.5">{getScoreLabel(score, hole.par)}</p>
            )}
          </div>

          {/* Score display */}
          <motion.div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
              score !== null ? `${style.bg} ${style.ring} ${style.text}` : 'bg-white/[0.03] text-white/15'
            }`}
            animate={wasJustScored ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {score ?? '–'}
          </motion.div>
        </button>

        {/* Expanded score entry */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-3.5 pb-4">
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => { e.stopPropagation(); adjustScore(idx, -1) }}
                    className="w-12 h-12 rounded-2xl glass flex items-center justify-center"
                  >
                    <Minus size={18} className="text-white/50" />
                  </motion.button>

                  <div className="text-center w-20">
                    <motion.p
                      key={score}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-4xl font-bold"
                    >
                      {score ?? hole.par}
                    </motion.p>
                    <p className="text-[10px] text-white/25 mt-0.5">
                      {score !== null ? getScoreLabel(score, hole.par) : 'Tap to set'}
                    </p>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => { e.stopPropagation(); adjustScore(idx, 1) }}
                    className="w-12 h-12 rounded-2xl glass flex items-center justify-center"
                  >
                    <Plus size={18} className="text-white/50" />
                  </motion.button>
                </div>

                {/* Quick score buttons */}
                <div className="flex justify-center gap-1.5 mt-3">
                  {Array.from({ length: 6 }, (_, j) => {
                    const val = Math.max(1, hole.par - 2) + j
                    if (val > hole.par + 3) return null
                    const s = getScoreStyle(val, hole.par)
                    return (
                      <motion.button
                        key={val}
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => { e.stopPropagation(); setScore(idx, val); setActiveHole(null) }}
                        className={`w-10 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                          score === val ? `${s.bg} ${s.text}` : 'bg-white/5 text-white/30 hover:bg-white/10'
                        }`}
                      >
                        {val}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div className="px-5 pt-14">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold tracking-tight">Scorecard</h1>
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.9 }} onClick={reset} className="p-2.5 glass rounded-xl">
            <RotateCcw size={15} className="text-white/30" />
          </motion.button>
        </div>
      </div>

      {/* Course selector */}
      <div className="relative mb-4">
        <button
          onClick={() => setShowCourseSelect(!showCourseSelect)}
          className="glass rounded-xl px-3.5 py-2 flex items-center gap-2 text-sm"
        >
          <span>{course.image}</span>
          <span className="text-white/50">{course.name}</span>
          <ChevronDown size={13} className="text-white/20" />
        </button>
        <AnimatePresence>
          {showCourseSelect && (
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              className="absolute top-full mt-1 left-0 z-20 glass-strong rounded-2xl overflow-hidden w-64"
            >
              {courses.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setCourseId(c.id); setShowCourseSelect(false); setScores(Array(18).fill(null)); setActiveHole(null) }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 flex items-center gap-2.5 transition-colors"
                >
                  <span>{c.image}</span>
                  <span className="text-white/70">{c.name}</span>
                  {c.id === courseId && <Check size={14} className="text-emerald-400 ml-auto" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Score Summary - sticky */}
      <motion.div
        className="glass-emerald rounded-2xl p-4 mb-4 glow"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-around text-center mb-3">
          <div>
            <p className="text-3xl font-bold">{holesPlayed > 0 ? totalScore : '–'}</p>
            <p className="text-[10px] text-white/25">Score</p>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div>
            <p className={`text-3xl font-bold ${
              toPar < 0 ? 'text-emerald-400' : toPar > 0 ? 'text-red-400' : 'text-white/40'
            }`}>
              {holesPlayed > 0 ? (toPar > 0 ? `+${toPar}` : toPar === 0 ? 'E' : toPar) : '–'}
            </p>
            <p className="text-[10px] text-white/25">To Par</p>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div>
            <p className="text-3xl font-bold text-white/40">{holesPlayed}/18</p>
            <p className="text-[10px] text-white/25">Holes</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex gap-3 mb-4 justify-center">
        {[
          { color: 'bg-amber-500', label: 'Eagle' },
          { color: 'bg-emerald-500', label: 'Birdie' },
          { color: 'bg-white/10', label: 'Par' },
          { color: 'bg-blue-500/60', label: 'Bogey' },
          { color: 'bg-red-500/60', label: 'Dbl+' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
            <span className="text-[9px] text-white/25">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Front 9 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">Front 9</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/20">Par {frontPar}</span>
            {frontScore > 0 && (
              <span className={`text-[11px] font-bold ${
                frontScore - frontPar < 0 ? 'text-emerald-400' : frontScore - frontPar > 0 ? 'text-red-400' : 'text-white/40'
              }`}>{frontScore}</span>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          {frontNine.map((hole, i) => renderHole(hole, i))}
        </div>
      </div>

      {/* Back 9 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-[10px] font-semibold text-white/25 uppercase tracking-widest">Back 9</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/20">Par {backPar}</span>
            {backScore > 0 && (
              <span className={`text-[11px] font-bold ${
                backScore - backPar < 0 ? 'text-emerald-400' : backScore - backPar > 0 ? 'text-red-400' : 'text-white/40'
              }`}>{backScore}</span>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          {backNine.map((hole, i) => renderHole(hole, i + 9))}
        </div>
      </div>
    </div>
  )
}
