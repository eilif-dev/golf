import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Trophy, Swords, UserPlus, ChevronRight, Flame, Award, Target } from 'lucide-react'
import toast from 'react-hot-toast'
import { activityFeed, challenges, friends, friendRequests, players, courses, currentPlayer } from '../data'

type Tab = 'feed' | 'challenges' | 'compare'

export default function Activity({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [tab, setTab] = useState<Tab>('feed')
  const [likes, setLikes] = useState<Record<string, boolean>>(
    Object.fromEntries(activityFeed.map(a => [a.id, a.likedByMe]))
  )
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(
    Object.fromEntries(activityFeed.map(a => [a.id, a.likes]))
  )
  const [compareWith, setCompareWith] = useState<string | null>(null)

  const toggleLike = (id: string) => {
    const wasLiked = likes[id]
    setLikes(prev => ({ ...prev, [id]: !wasLiked }))
    setLikeCounts(prev => ({ ...prev, [id]: prev[id] + (wasLiked ? -1 : 1) }))
    if (!wasLiked) toast('❤️', { duration: 800 })
  }

  const friendPlayers = players.filter(p => friends.includes(p.id))

  return (
    <div className="px-5 pt-14">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold tracking-tight">Social</h1>
        {friendRequests.length > 0 && (
          <div className="relative">
            <UserPlus size={20} className="text-white/40" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-[8px] font-bold">{friendRequests.length}</span>
            </div>
          </div>
        )}
      </div>
      <p className="text-white/30 text-sm mb-5">See what your golf buddies are up to</p>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 glass rounded-2xl mb-5">
        {([
          { id: 'feed' as Tab, label: 'Feed', icon: Flame },
          { id: 'challenges' as Tab, label: 'Challenges', icon: Trophy },
          { id: 'compare' as Tab, label: 'Compare', icon: Swords },
        ]).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              tab === t.id ? 'bg-emerald-500/15 text-emerald-400' : 'text-white/30'
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'feed' && (
          <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Friend requests banner */}
            {friendRequests.length > 0 && (
              <motion.div
                className="glass-emerald rounded-2xl p-4 mb-4 flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex -space-x-2">
                  {friendRequests.map(fr => {
                    const p = players.find(pl => pl.id === fr.playerId)!
                    return <div key={fr.playerId} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-lg border-2 border-[#111]">{p.avatar}</div>
                  })}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{friendRequests.length} friend request{friendRequests.length > 1 ? 's' : ''}</p>
                  <p className="text-[10px] text-white/30">{friendRequests.map(fr => players.find(p => p.id === fr.playerId)!.name.split(' ')[0]).join(', ')}</p>
                </div>
                <ChevronRight size={16} className="text-emerald-400/40" />
              </motion.div>
            )}

            {/* Activity Feed */}
            <div className="space-y-3">
              {activityFeed.map((activity, i) => {
                const player = players.find(p => p.id === activity.playerId)!
                const course = activity.courseId ? courses.find(c => c.id === activity.courseId) : null
                const isLiked = likes[activity.id]

                return (
                  <motion.div
                    key={activity.id}
                    className="glass rounded-2xl p-4"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                        {player.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{player.name}</p>
                        <p className="text-[10px] text-white/20">{activity.timeAgo}</p>
                      </div>
                      {activity.type === 'round' && (
                        <div className="text-right">
                          <p className="text-xl font-bold">{activity.score}</p>
                          <p className={`text-[10px] font-semibold ${
                            (activity.toPar ?? 0) < 0 ? 'text-emerald-400' : (activity.toPar ?? 0) > 0 ? 'text-red-400' : 'text-white/30'
                          }`}>
                            {(activity.toPar ?? 0) > 0 ? '+' : ''}{(activity.toPar ?? 0) === 0 ? 'E' : activity.toPar}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    {activity.type === 'round' && course && (
                      <div className="bg-white/[0.02] rounded-xl p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm">{course.image}</span>
                          <span className="text-xs text-white/50">{course.name}</span>
                          <span className="text-[10px] text-white/15">· Par {course.par}</span>
                        </div>
                        <div className="flex gap-4">
                          <div>
                            <p className="text-[10px] text-white/20">Birdies</p>
                            <p className="text-sm font-bold text-emerald-400">{activity.birdies}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/20">Score</p>
                            <p className="text-sm font-bold">{activity.score}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/20">HCP</p>
                            <p className="text-sm font-bold text-white/40">{player.handicap}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {(activity.type === 'achievement' || activity.type === 'challenge_complete') && (
                      <div className="bg-white/[0.02] rounded-xl p-3 mb-3 flex items-center gap-2">
                        <Award size={16} className="text-amber-400" />
                        <p className="text-sm text-white/60">{activity.message}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => toggleLike(activity.id)}
                        className="flex items-center gap-1.5"
                      >
                        <motion.div animate={isLiked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                          <Heart
                            size={16}
                            className={isLiked ? 'text-red-400 fill-red-400' : 'text-white/20'}
                          />
                        </motion.div>
                        <span className={`text-xs ${isLiked ? 'text-red-400' : 'text-white/20'}`}>
                          {likeCounts[activity.id]}
                        </span>
                      </motion.button>
                      <button className="flex items-center gap-1.5">
                        <MessageCircle size={16} className="text-white/20" />
                        <span className="text-xs text-white/20">{activity.comments}</span>
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {tab === 'challenges' && (
          <motion.div key="challenges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="space-y-4">
              {challenges.map((ch, ci) => {
                // Sort participants by progress
                const sorted = [...ch.participants].sort((a, b) => {
                  if (ch.type === 'lowest_score') return (ch.progress[a] ?? 999) - (ch.progress[b] ?? 999)
                  return (ch.progress[b] ?? 0) - (ch.progress[a] ?? 0)
                })
                const myRank = sorted.indexOf(currentPlayer.id) + 1
                const leader = players.find(p => p.id === sorted[0])!

                return (
                  <motion.div
                    key={ch.id}
                    className="glass rounded-2xl p-5"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ci * 0.08 }}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-2xl">
                        {ch.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold">{ch.title}</h3>
                        <p className="text-[11px] text-white/30">{ch.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-white/20">Ends in</p>
                        <p className="text-xs font-semibold text-amber-400">{ch.endsIn}</p>
                      </div>
                    </div>

                    {/* Leaderboard mini */}
                    <div className="space-y-1.5">
                      {sorted.slice(0, 5).map((pid, rank) => {
                        const p = players.find(pl => pl.id === pid)!
                        const val = ch.progress[pid] ?? 0
                        const isMe = pid === currentPlayer.id
                        const isLeader = rank === 0

                        return (
                          <div
                            key={pid}
                            className={`flex items-center gap-2.5 p-2 rounded-xl ${
                              isMe ? 'bg-emerald-500/8 border border-emerald-500/15' : 'bg-white/[0.02]'
                            }`}
                          >
                            <span className={`text-xs font-bold w-5 text-center ${
                              rank === 0 ? 'text-amber-400' : rank === 1 ? 'text-white/40' : rank === 2 ? 'text-amber-600' : 'text-white/20'
                            }`}>
                              {rank + 1}
                            </span>
                            <span className="text-sm">{p.avatar}</span>
                            <span className={`text-xs flex-1 ${isMe ? 'font-semibold text-emerald-400' : 'text-white/50'}`}>
                              {isMe ? 'You' : p.name.split(' ')[0]}
                            </span>
                            <span className={`text-sm font-bold ${isLeader ? 'text-amber-400' : isMe ? 'text-emerald-400' : 'text-white/40'}`}>
                              {val} {ch.unit === 'strokes' ? '' : ch.unit}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Goal progress for goal-based challenges */}
                    {ch.goal > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] text-white/20">Your progress</span>
                          <span className="text-[10px] text-white/30">{ch.progress[currentPlayer.id] ?? 0}/{ch.goal}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-emerald-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, ((ch.progress[currentPlayer.id] ?? 0) / ch.goal) * 100)}%` }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex -space-x-1.5">
                        {sorted.slice(0, 4).map(pid => {
                          const p = players.find(pl => pl.id === pid)!
                          return <div key={pid} className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] border border-[#111]">{p.avatar}</div>
                        })}
                      </div>
                      <span className="text-[10px] text-white/20">{ch.participants.length} competing</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {tab === 'compare' && (
          <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {!compareWith ? (
              <div>
                <p className="text-xs text-white/30 mb-3">Select a friend to compare stats</p>
                <div className="space-y-2">
                  {friendPlayers.map((p, i) => (
                    <motion.button
                      key={p.id}
                      onClick={() => setCompareWith(p.id)}
                      className="w-full glass rounded-2xl p-4 flex items-center gap-3"
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-2xl">{p.avatar}</div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold">{p.name}</p>
                        <p className="text-[10px] text-white/20">HCP {p.handicap} · {p.rounds} rounds</p>
                      </div>
                      <Swords size={16} className="text-emerald-400/30" />
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <CompareView
                player1={currentPlayer}
                player2={players.find(p => p.id === compareWith)!}
                onBack={() => setCompareWith(null)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CompareView({ player1, player2, onBack }: { player1: typeof players[0], player2: typeof players[0], onBack: () => void }) {
  const stats = [
    { label: 'Handicap', v1: player1.handicap, v2: player2.handicap, lower: true },
    { label: 'Avg Score', v1: player1.avgScore, v2: player2.avgScore, lower: true },
    { label: 'Best Score', v1: player1.bestScore, v2: player2.bestScore, lower: true },
    { label: 'Rounds', v1: player1.rounds, v2: player2.rounds, lower: false },
  ]

  const getWinner = (v1: number, v2: number, lowerBetter: boolean) => {
    if (v1 === v2) return 'tie'
    return lowerBetter ? (v1 < v2 ? 'p1' : 'p2') : (v1 > v2 ? 'p1' : 'p2')
  }

  const p1Wins = stats.filter(s => getWinner(s.v1, s.v2, s.lower) === 'p1').length
  const p2Wins = stats.filter(s => getWinner(s.v1, s.v2, s.lower) === 'p2').length

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={onBack} className="text-xs text-emerald-400 mb-4 flex items-center gap-1">
        ← Back to friends
      </button>

      {/* VS Header */}
      <div className="glass-emerald rounded-2xl p-5 mb-5 glow text-center">
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mx-auto mb-2">
              {player1.avatar}
            </div>
            <p className="text-sm font-bold">You</p>
            <p className="text-[10px] text-white/25">HCP {player1.handicap}</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-black text-emerald-400">{p1Wins}</p>
            <p className="text-white/15 text-xs font-bold my-1">VS</p>
            <p className="text-2xl font-black text-blue-400">{p2Wins}</p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mx-auto mb-2">
              {player2.avatar}
            </div>
            <p className="text-sm font-bold">{player2.name.split(' ')[0]}</p>
            <p className="text-[10px] text-white/25">HCP {player2.handicap}</p>
          </div>
        </div>
      </div>

      {/* Stat comparisons */}
      <div className="space-y-2">
        {stats.map((stat, i) => {
          const winner = getWinner(stat.v1, stat.v2, stat.lower)
          return (
            <motion.div
              key={stat.label}
              className="glass rounded-2xl p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <p className="text-[10px] text-white/20 text-center mb-2 uppercase tracking-wider">{stat.label}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 text-right">
                  <span className={`text-xl font-bold ${winner === 'p1' ? 'text-emerald-400' : 'text-white/40'}`}>
                    {stat.v1}
                  </span>
                </div>

                {/* Bar comparison */}
                <div className="w-24 flex gap-0.5">
                  <motion.div
                    className={`h-2 rounded-l-full ${winner === 'p1' ? 'bg-emerald-500' : 'bg-white/10'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.v1 / (stat.v1 + stat.v2)) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
                    style={{ flex: stat.v1 }}
                  />
                  <motion.div
                    className={`h-2 rounded-r-full ${winner === 'p2' ? 'bg-blue-500' : 'bg-white/10'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.v2 / (stat.v1 + stat.v2)) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
                    style={{ flex: stat.v2 }}
                  />
                </div>

                <div className="flex-1 text-left">
                  <span className={`text-xl font-bold ${winner === 'p2' ? 'text-blue-400' : 'text-white/40'}`}>
                    {stat.v2}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Head to head challenge CTA */}
      <motion.button
        className="w-full mt-5 rounded-2xl p-4 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-white/5 text-center"
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Swords size={18} className="text-white/40 mx-auto mb-1" />
        <p className="text-sm font-semibold">Challenge {player2.name.split(' ')[0]}</p>
        <p className="text-[10px] text-white/20">Start a 1v1 challenge</p>
      </motion.button>
    </motion.div>
  )
}
