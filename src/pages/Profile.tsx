import { motion } from 'framer-motion'
import { Award, TrendingDown, Calendar, Target, Zap, BarChart3, Settings, LogOut } from 'lucide-react'
import { currentPlayer, achievements, courses } from '../data'

const recentRounds = [
  { date: 'Mar 25', course: 'Bogstad', score: 82, toPar: 10 },
  { date: 'Mar 22', course: 'Hovedbanen', score: 79, toPar: 8 },
  { date: 'Mar 18', course: 'Losby', score: 85, toPar: 13 },
  { date: 'Mar 14', course: 'Bogstad', score: 76, toPar: 4 },
  { date: 'Mar 10', course: 'Hovedbanen', score: 84, toPar: 13 },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

export default function Profile() {
  return (
    <motion.div className="px-4 pt-12" variants={container} initial="hidden" animate="show">
      {/* Profile Header */}
      <motion.div variants={item} className="text-center mb-6">
        <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-5xl mx-auto mb-3">
          {currentPlayer.avatar}
        </div>
        <h1 className="text-2xl font-bold">{currentPlayer.name}</h1>
        <p className="text-white/40 text-sm">Member since 2019</p>
      </motion.div>

      {/* Handicap Card */}
      <motion.div variants={item} className="glass rounded-2xl p-5 mb-4 glow text-center">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Official Handicap</p>
        <p className="text-6xl font-light gradient-text">{currentPlayer.handicap}</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <TrendingDown size={14} className="text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">-0.8 this month</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-4 gap-2 mb-4">
        {[
          { icon: Calendar, label: 'Rounds', value: currentPlayer.rounds, color: 'text-emerald-400' },
          { icon: Target, label: 'Average', value: currentPlayer.avgScore, color: 'text-blue-400' },
          { icon: Zap, label: 'Best', value: currentPlayer.bestScore, color: 'text-amber-400' },
          { icon: BarChart3, label: 'FIR %', value: '62%', color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-3 text-center">
            <s.icon size={16} className={`${s.color} mx-auto mb-1`} />
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-white/30">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Recent Rounds */}
      <motion.div variants={item}>
        <h2 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">Recent Rounds</h2>
        <div className="space-y-1.5 mb-5">
          {recentRounds.map((round, i) => (
            <motion.div
              key={i}
              className="glass rounded-xl p-3 flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{round.course}</p>
                <p className="text-[10px] text-white/30">{round.date}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{round.score}</p>
                <p className={`text-[10px] font-medium ${round.toPar <= 5 ? 'text-emerald-400' : 'text-white/40'}`}>
                  +{round.toPar}
                </p>
              </div>
              {/* Mini score bar */}
              <div className="w-12 h-6 flex items-end gap-px">
                {Array.from({ length: 6 }, (_, j) => (
                  <div
                    key={j}
                    className="flex-1 rounded-t bg-emerald-500/30"
                    style={{ height: `${20 + Math.random() * 80}%` }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div variants={item}>
        <h2 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">Achievements</h2>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {achievements.map(a => (
            <motion.div
              key={a.id}
              className={`glass rounded-xl p-3 text-center relative ${!a.unlocked ? 'opacity-40' : ''}`}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">{a.icon}</span>
              <p className="text-[10px] font-medium mt-1">{a.name}</p>
              {!a.unlocked && a.progress !== undefined && a.progress > 0 && (
                <div className="w-full h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500/50 rounded-full"
                    style={{ width: `${(a.progress / 100) * 100}%` }}
                  />
                </div>
              )}
              {a.unlocked && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-[8px]">✓</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div variants={item} className="space-y-2 mb-4">
        <button className="w-full glass rounded-xl p-3 flex items-center gap-3 text-sm text-white/60">
          <Settings size={16} /> Settings
        </button>
        <button className="w-full glass rounded-xl p-3 flex items-center gap-3 text-sm text-red-400/60">
          <LogOut size={16} /> Sign Out
        </button>
      </motion.div>
    </motion.div>
  )
}
