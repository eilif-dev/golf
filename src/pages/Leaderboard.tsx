import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react'
import { leaderboard, players } from '../data'

export default function Leaderboard() {
  return (
    <div className="px-4 pt-12">
      <h1 className="text-2xl font-bold mb-1">Leaderboard</h1>
      <p className="text-white/40 text-sm mb-6">Oslo Golf Club Championship 2026</p>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-3 mb-8">
        {[1, 0, 2].map((idx, pos) => {
          const entry = leaderboard[idx]
          if (!entry) return null
          const player = players.find(p => p.id === entry.playerId)!
          const heights = ['h-28', 'h-36', 'h-24']
          const sizes = ['text-3xl', 'text-4xl', 'text-3xl']
          const medals = ['🥈', '🥇', '🥉']
          const isFirst = pos === 1

          return (
            <motion.div
              key={entry.playerId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pos * 0.15 }}
              className="flex flex-col items-center"
            >
              <span className="text-xl mb-1">{medals[pos]}</span>
              <span className={`${sizes[pos]} mb-1`}>{player.avatar}</span>
              <p className="text-xs font-semibold text-center w-20 truncate">{player.name.split(' ')[0]}</p>
              <div className={`w-20 ${heights[pos]} mt-2 rounded-t-xl flex flex-col items-center justify-center ${
                isFirst ? 'bg-gradient-to-t from-emerald-600/30 to-emerald-500/10 border border-emerald-500/20' : 'glass'
              }`}>
                <p className={`text-xl font-bold ${isFirst ? 'gradient-text' : ''}`}>{entry.score}</p>
                <p className={`text-xs font-medium ${entry.toPar < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {entry.toPar > 0 ? '+' : ''}{entry.toPar}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Full List */}
      <div className="space-y-2">
        {leaderboard.map((entry, i) => {
          const player = players.find(p => p.id === entry.playerId)!
          const MovementIcon = entry.movement === 'up' ? TrendingUp : entry.movement === 'down' ? TrendingDown : Minus
          const movementColor = entry.movement === 'up' ? 'text-emerald-400' : entry.movement === 'down' ? 'text-red-400' : 'text-white/20'
          
          return (
            <motion.div
              key={entry.playerId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass rounded-xl p-3 flex items-center gap-3 ${
                i === 0 ? 'glow border-emerald-500/20' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                i < 3 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'
              }`}>
                {i + 1}
              </div>
              
              <span className="text-2xl">{player.avatar}</span>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{player.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/30">HCP {player.handicap}</span>
                  <span className="text-[10px] text-white/20">•</span>
                  <span className="text-[10px] text-white/30">
                    Thru {entry.thru === 'F' ? '18' : entry.thru}
                    {entry.thru === 'F' && <span className="text-emerald-400 ml-0.5">✓</span>}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MovementIcon size={14} className={movementColor} />
                <div className="text-right">
                  <p className="text-lg font-bold">{entry.score}</p>
                  <p className={`text-xs font-medium ${
                    entry.toPar < 0 ? 'text-emerald-400' : entry.toPar > 0 ? 'text-red-400' : 'text-white/40'
                  }`}>
                    {entry.toPar > 0 ? '+' : ''}{entry.toPar === 0 ? 'E' : entry.toPar}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Tournament Info */}
      <div className="glass rounded-xl p-4 mt-6 mb-4 text-center">
        <Trophy size={20} className="text-emerald-400 mx-auto mb-2" />
        <p className="text-xs text-white/40">Round 2 of 4 • Bogstad Banen</p>
        <p className="text-[10px] text-white/20 mt-1">Updated live</p>
      </div>
    </div>
  )
}
