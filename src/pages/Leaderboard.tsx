import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Trophy, ChevronDown } from 'lucide-react'
import { leaderboard, players } from '../data'

export default function Leaderboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null)

  const top3 = [leaderboard[1], leaderboard[0], leaderboard[2]] // 2nd, 1st, 3rd for podium layout

  return (
    <div className="px-5 pt-14">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
        <div className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
          <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            LIVE
          </span>
        </div>
      </div>
      <p className="text-white/30 text-sm mb-8">Oslo Golf Club Championship 2026</p>

      {/* Podium */}
      <div className="flex items-end justify-center gap-3 mb-10 px-2">
        {top3.map((entry, pos) => {
          if (!entry) return null
          const player = players.find(p => p.id === entry.playerId)!
          const heights = [140, 170, 120] // px heights for podium
          const avatarSizes = ['text-3xl', 'text-4xl', 'text-3xl']
          const medals = ['🥈', '🥇', '🥉']
          const isFirst = pos === 1
          const podiumColors = [
            'from-white/5 to-white/[0.02]',
            'from-emerald-500/15 to-emerald-500/5',
            'from-white/5 to-white/[0.02]'
          ]

          return (
            <motion.div
              key={entry.playerId}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pos === 1 ? 0 : pos === 0 ? 0.15 : 0.25, type: 'spring', damping: 20 }}
              className="flex flex-col items-center flex-1"
            >
              {/* Medal + avatar */}
              <span className="text-2xl mb-1">{medals[pos]}</span>
              <div className={`${isFirst ? 'w-16 h-16' : 'w-12 h-12'} rounded-2xl bg-white/5 flex items-center justify-center ${avatarSizes[pos]} mb-2 ${isFirst ? 'ring-2 ring-emerald-500/30' : ''}`}>
                {player.avatar}
              </div>
              <p className="text-xs font-semibold text-center truncate w-full">{player.name.split(' ')[0]}</p>
              
              {/* Podium bar */}
              <motion.div
                className={`w-full mt-2 rounded-t-2xl flex flex-col items-center justify-center bg-gradient-to-t ${podiumColors[pos]} border border-white/5 ${isFirst ? 'border-emerald-500/15' : ''}`}
                style={{ height: heights[pos] }}
                initial={{ height: 0 }}
                animate={{ height: heights[pos] }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <p className={`text-2xl font-bold ${isFirst ? 'gradient-text' : ''}`}>{entry.score}</p>
                <p className={`text-xs font-semibold mt-0.5 ${
                  entry.toPar < 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {entry.toPar > 0 ? '+' : ''}{entry.toPar}
                </p>
                <p className="text-[9px] text-white/20 mt-1">
                  {entry.thru === 'F' ? 'Final' : `Thru ${entry.thru}`}
                </p>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* Full List */}
      <div className="space-y-1.5">
        {leaderboard.map((entry, i) => {
          const player = players.find(p => p.id === entry.playerId)!
          const MovementIcon = entry.movement === 'up' ? TrendingUp : entry.movement === 'down' ? TrendingDown : Minus
          const movementColor = entry.movement === 'up' ? 'text-emerald-400' : entry.movement === 'down' ? 'text-red-400' : 'text-white/15'
          const isExpanded = expandedPlayer === entry.playerId
          
          return (
            <motion.div
              key={entry.playerId}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <button
                onClick={() => setExpandedPlayer(isExpanded ? null : entry.playerId)}
                className={`w-full glass rounded-2xl p-3.5 flex items-center gap-3 transition-all ${
                  i === 0 ? 'glow-strong glass-emerald' : ''
                }`}
              >
                {/* Rank */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-emerald-500/20 text-emerald-400' :
                  i === 1 ? 'bg-white/8 text-white/60' :
                  i === 2 ? 'bg-amber-500/10 text-amber-400/60' :
                  'bg-white/[0.03] text-white/25'
                }`}>
                  {i + 1}
                </div>
                
                <span className="text-xl">{player.avatar}</span>

                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold truncate">{player.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-white/20">HCP {player.handicap}</span>
                    <span className="text-[10px] text-white/10">·</span>
                    <span className={`text-[10px] ${entry.thru === 'F' ? 'text-emerald-400/50' : 'text-white/20'}`}>
                      {entry.thru === 'F' ? 'Finished ✓' : `Thru ${entry.thru}`}
                    </span>
                  </div>
                </div>

                <MovementIcon size={13} className={movementColor} />

                <div className="text-right w-14">
                  <p className="text-lg font-bold">{entry.score}</p>
                  <p className={`text-[11px] font-semibold ${
                    entry.toPar < 0 ? 'text-emerald-400' : entry.toPar > 0 ? 'text-red-400' : 'text-white/30'
                  }`}>
                    {entry.toPar > 0 ? '+' : ''}{entry.toPar === 0 ? 'E' : entry.toPar}
                  </p>
                </div>
              </button>

              {/* Expanded round details */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 flex gap-3">
                    <div className="flex-1 bg-white/[0.02] rounded-xl p-3 text-center">
                      <p className="text-[10px] text-white/20 mb-1">Front 9</p>
                      <p className="text-lg font-bold">{entry.round[0]}</p>
                    </div>
                    <div className="flex-1 bg-white/[0.02] rounded-xl p-3 text-center">
                      <p className="text-[10px] text-white/20 mb-1">Back 9</p>
                      <p className="text-lg font-bold">{entry.round[1]}</p>
                    </div>
                    <div className="flex-1 bg-white/[0.02] rounded-xl p-3 text-center">
                      <p className="text-[10px] text-white/20 mb-1">Avg</p>
                      <p className="text-lg font-bold text-white/50">{player.avgScore}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Tournament Info */}
      <motion.div
        className="glass rounded-2xl p-5 mt-6 mb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Trophy size={20} className="text-emerald-400/50 mx-auto mb-2" />
        <p className="text-xs text-white/30 font-medium">Round 2 of 4 · Bogstad Banen</p>
        <p className="text-[10px] text-white/15 mt-1">Cut line: +8 after round 2</p>
      </motion.div>
    </div>
  )
}
