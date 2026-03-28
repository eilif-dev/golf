import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, Calendar, Target, Zap, BarChart3, Settings, LogOut, ChevronRight, Edit3 } from 'lucide-react'
import { currentPlayer, achievements } from '../data'

// Seeded sparkline data (stable across renders)
const roundHistory = [88, 85, 82, 86, 79, 84, 82, 80, 85, 76, 82, 79, 85, 76, 84]
const handicapTrend = [14.2, 13.8, 13.5, 13.1, 12.8, 12.4]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

const recentRounds = [
  { date: 'Mar 25', course: 'Bogstad Banen', score: 82, toPar: 10, emoji: '🏔️' },
  { date: 'Mar 22', course: 'Hovedbanen', score: 79, toPar: 8, emoji: '🌲' },
  { date: 'Mar 18', course: 'Losby Banen', score: 85, toPar: 13, emoji: '🦌' },
  { date: 'Mar 14', course: 'Bogstad Banen', score: 76, toPar: 4, emoji: '🏔️' },
  { date: 'Mar 10', course: 'Hovedbanen', score: 84, toPar: 13, emoji: '🌲' },
]

function MiniChart({ data, color, height = 40 }: { data: number[], color: string, height?: number }) {
  const min = Math.min(...data) - 2
  const max = Math.max(...data) + 2
  const range = max - min
  const w = 100 / (data.length - 1)
  
  const points = data.map((v, i) => `${i * w},${height - ((v - min) / range) * height}`).join(' ')
  const areaPoints = `0,${height} ${points} ${100},${height}`

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${color})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function Profile({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <motion.div className="px-5 pt-14" variants={container} initial="hidden" animate="show">
      {/* Profile Header */}
      <motion.div variants={item} className="flex items-center gap-4 mb-6">
        <div className="w-18 h-18 rounded-2xl bg-emerald-500/8 border border-emerald-500/15 flex items-center justify-center text-5xl">
          {currentPlayer.avatar}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{currentPlayer.name}</h1>
          <p className="text-white/30 text-sm">Member since 2019</p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/15">
              <span className="text-[10px] text-emerald-400 font-semibold">PRO</span>
            </div>
            <span className="text-[10px] text-white/20">{currentPlayer.rounds} rounds played</span>
          </div>
        </div>
      </motion.div>

      {/* Handicap Card */}
      <motion.div variants={item} className="glass-emerald rounded-2xl p-5 mb-4 glow relative overflow-hidden noise">
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-emerald-400/50 text-[10px] font-semibold uppercase tracking-widest">Official Handicap</p>
              <p className="text-5xl font-extralight gradient-text mt-1">{currentPlayer.handicap}</p>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10">
              <TrendingDown size={12} className="text-emerald-400" />
              <span className="text-[11px] text-emerald-400 font-semibold">-0.8</span>
            </div>
          </div>
          {/* Handicap trend chart */}
          <div className="mt-3">
            <MiniChart data={handicapTrend} color="#10b981" height={35} />
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-white/15">Oct</span>
              <span className="text-[9px] text-white/15">Mar</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-4 gap-2 mb-5">
        {[
          { icon: Calendar, label: 'Rounds', value: currentPlayer.rounds, color: 'text-emerald-400' },
          { icon: Target, label: 'Average', value: currentPlayer.avgScore, color: 'text-blue-400' },
          { icon: Zap, label: 'Best', value: currentPlayer.bestScore, color: 'text-amber-400' },
          { icon: BarChart3, label: 'FIR', value: '62%', color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-3 text-center">
            <s.icon size={14} className={`${s.color} mx-auto mb-1.5 opacity-70`} />
            <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[8px] text-white/20 mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Score Trend */}
      <motion.div variants={item} className="glass rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-white/40">Score Trend</p>
          <span className="text-[10px] text-white/20">Last 15 rounds</span>
        </div>
        <MiniChart data={roundHistory} color="#3b82f6" height={50} />
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-white/15">15 rounds ago</span>
          <span className="text-[9px] text-white/15">Latest</span>
        </div>
      </motion.div>

      {/* Recent Rounds */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Recent Rounds</p>
        </div>
        <div className="space-y-1.5 mb-5">
          {recentRounds.map((round, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl p-3.5 flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.04 }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-lg">
                {round.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{round.course}</p>
                <p className="text-[10px] text-white/20">{round.date}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{round.score}</p>
                <p className={`text-[10px] font-semibold ${round.toPar <= 5 ? 'text-emerald-400/60' : 'text-white/25'}`}>
                  +{round.toPar}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div variants={item}>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Achievements</p>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {achievements.map(a => (
            <motion.div
              key={a.id}
              className={`glass rounded-2xl p-3.5 text-center relative overflow-hidden ${!a.unlocked ? 'opacity-30' : ''}`}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">{a.icon}</span>
              <p className="text-[10px] font-medium mt-1.5 text-white/70">{a.name}</p>
              {!a.unlocked && a.progress !== undefined && a.progress > 0 && (
                <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500/40 rounded-full"
                    style={{ width: `${a.progress}%` }}
                  />
                </div>
              )}
              {a.unlocked && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-[7px] font-bold">✓</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div variants={item} className="space-y-1.5 mb-6">
        <button className="w-full glass rounded-2xl p-3.5 flex items-center gap-3 text-sm text-white/40">
          <Settings size={16} />
          <span className="flex-1 text-left">Settings</span>
          <ChevronRight size={14} className="text-white/15" />
        </button>
        <button className="w-full glass rounded-2xl p-3.5 flex items-center gap-3 text-sm text-red-400/40">
          <LogOut size={16} />
          <span className="flex-1 text-left">Sign Out</span>
        </button>
      </motion.div>
    </motion.div>
  )
}
