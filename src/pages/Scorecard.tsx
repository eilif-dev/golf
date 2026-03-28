import { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, ChevronDown, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { courses } from '../data'

export default function Scorecard() {
  const [courseId, setCourseId] = useState(courses[0].id)
  const course = courses.find(c => c.id === courseId)!
  const [scores, setScores] = useState<(number | null)[]>(Array(18).fill(null))
  const [showCourseSelect, setShowCourseSelect] = useState(false)

  const setScore = (hole: number, score: number) => {
    const next = [...scores]
    next[hole] = score
    setScores(next)
    
    const diff = score - course.holes[hole].par
    if (diff <= -2) toast('🦅 Eagle!', { duration: 2000 })
    else if (diff === -1) toast('🐦 Birdie!', { duration: 1500 })
    else if (score === 1) toast('🏆 HOLE IN ONE!!!', { duration: 4000 })
  }

  const totalScore = scores.reduce<number>((sum, s) => sum + (s || 0), 0)
  const holesPlayed = scores.filter(s => s !== null).length
  const totalPar = course.holes.slice(0, holesPlayed).reduce((s, h) => s + h.par, 0)
  const toPar = holesPlayed > 0 ? totalScore - totalPar : 0

  const frontNine = course.holes.slice(0, 9)
  const backNine = course.holes.slice(9)
  const frontScore = scores.slice(0, 9).reduce<number>((s, v) => s + (v || 0), 0)
  const backScore = scores.slice(9).reduce<number>((s, v) => s + (v || 0), 0)
  const frontPar = frontNine.reduce((s, h) => s + h.par, 0)
  const backPar = backNine.reduce((s, h) => s + h.par, 0)

  const getScoreColor = (score: number | null, par: number) => {
    if (score === null) return ''
    const diff = score - par
    if (diff <= -2) return 'bg-amber-500 text-white'
    if (diff === -1) return 'bg-emerald-500 text-white'
    if (diff === 0) return 'bg-white/10 text-white'
    if (diff === 1) return 'bg-blue-500/50 text-white'
    return 'bg-red-500/50 text-white'
  }

  const getScoreLabel = (score: number | null, par: number) => {
    if (score === null) return ''
    const diff = score - par
    if (diff <= -2) return 'Eagle'
    if (diff === -1) return 'Birdie'
    if (diff === 0) return 'Par'
    if (diff === 1) return 'Bogey'
    if (diff === 2) return 'Double'
    return `+${diff}`
  }

  const reset = () => {
    setScores(Array(18).fill(null))
    toast('Scorecard reset 🔄')
  }

  const renderNine = (holes: typeof frontNine, startIdx: number, label: string, nineScore: number, ninePar: number) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30">Par {ninePar}</span>
          {nineScore > 0 && (
            <span className={`text-xs font-bold ${nineScore - ninePar < 0 ? 'text-emerald-400' : nineScore - ninePar > 0 ? 'text-red-400' : 'text-white/60'}`}>
              {nineScore}
            </span>
          )}
        </div>
      </div>
      <div className="space-y-1.5">
        {holes.map((hole, i) => {
          const idx = startIdx + i
          const score = scores[idx]
          return (
            <motion.div
              key={hole.number}
              className="glass rounded-xl p-3 flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              {/* Hole info */}
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <span className="text-sm font-bold">{hole.number}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">Par {hole.par}</span>
                  <span className="text-[10px] text-white/20">{hole.distance}m</span>
                  <span className="text-[10px] text-white/20">HCP {hole.hcp}</span>
                </div>
                {score !== null && (
                  <span className="text-[10px] text-white/30">{getScoreLabel(score, hole.par)}</span>
                )}
              </div>
              {/* Score buttons */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 7 }, (_, j) => {
                  const val = Math.max(1, hole.par - 2) + j
                  if (val > hole.par + 4) return null
                  return (
                    <motion.button
                      key={val}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => setScore(idx, val)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                        score === val
                          ? getScoreColor(val, hole.par)
                          : 'bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      {val}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="px-4 pt-12">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">Scorecard</h1>
        <motion.button whileTap={{ scale: 0.9 }} onClick={reset} className="p-2 glass rounded-xl">
          <RotateCcw size={16} className="text-white/40" />
        </motion.button>
      </div>

      {/* Course selector */}
      <div className="relative mb-5">
        <button
          onClick={() => setShowCourseSelect(!showCourseSelect)}
          className="glass rounded-xl px-4 py-2 flex items-center gap-2 text-sm"
        >
          <span>{course.image}</span>
          <span className="text-white/60">{course.name}</span>
          <ChevronDown size={14} className="text-white/30" />
        </button>
        {showCourseSelect && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full mt-1 left-0 z-10 glass-strong rounded-xl overflow-hidden w-64"
          >
            {courses.map(c => (
              <button
                key={c.id}
                onClick={() => { setCourseId(c.id); setShowCourseSelect(false); setScores(Array(18).fill(null)) }}
                className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 flex items-center gap-2 transition-colors"
              >
                <span>{c.image}</span>
                <span>{c.name}</span>
                {c.id === courseId && <Check size={14} className="text-emerald-400 ml-auto" />}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Score Summary */}
      {holesPlayed > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-4 mb-5 flex items-center justify-around text-center glow"
        >
          <div>
            <p className="text-3xl font-bold">{totalScore}</p>
            <p className="text-[10px] text-white/30">Total</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className={`text-3xl font-bold ${toPar < 0 ? 'text-emerald-400' : toPar > 0 ? 'text-red-400' : 'text-white/60'}`}>
              {toPar > 0 ? '+' : ''}{toPar}
            </p>
            <p className="text-[10px] text-white/30">To Par</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="text-3xl font-bold text-white/60">{holesPlayed}</p>
            <p className="text-[10px] text-white/30">Holes</p>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { color: 'bg-amber-500', label: 'Eagle' },
          { color: 'bg-emerald-500', label: 'Birdie' },
          { color: 'bg-white/10', label: 'Par' },
          { color: 'bg-blue-500/50', label: 'Bogey' },
          { color: 'bg-red-500/50', label: 'Double+' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded ${l.color}`} />
            <span className="text-[10px] text-white/30">{l.label}</span>
          </div>
        ))}
      </div>

      {renderNine(frontNine, 0, 'Front 9', frontScore, frontPar)}
      {renderNine(backNine, 9, 'Back 9', backScore, backPar)}
    </div>
  )
}

