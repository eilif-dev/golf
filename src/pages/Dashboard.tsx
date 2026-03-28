import { motion } from 'framer-motion'
import { Cloud, Wind, Droplets, Sunrise, Sunset, ChevronRight, Clock } from 'lucide-react'
import { weather, teeTimes, courses, currentPlayer } from '../data'

const today = new Date().toISOString().split('T')[0]
const myUpcoming = teeTimes
  .filter(t => t.date === today && t.players.includes(currentPlayer.id))
  .slice(0, 2)

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

export default function Dashboard() {
  return (
    <motion.div className="px-4 pt-12" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="mb-6">
        <p className="text-white/40 text-sm font-medium">Welcome back</p>
        <h1 className="text-3xl font-bold mt-1">{currentPlayer.name.split(' ')[0]} {currentPlayer.avatar}</h1>
        <p className="text-white/30 text-sm mt-1">Handicap {currentPlayer.handicap}</p>
      </motion.div>

      {/* Weather Card */}
      <motion.div variants={item} className="glass rounded-2xl p-5 mb-4 glow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Course Conditions</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-5xl font-light">{weather.temp}°</span>
              <span className="text-white/50 text-sm">{weather.condition}</span>
            </div>
          </div>
          <span className="text-5xl">{weather.icon}</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Wind, label: 'Wind', value: weather.wind },
            { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%` },
            { icon: Sunrise, label: 'Sunrise', value: weather.sunrise },
            { icon: Sunset, label: 'Sunset', value: weather.sunset },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center">
              <Icon size={16} className="text-emerald-400 mx-auto mb-1" />
              <p className="text-[10px] text-white/30">{label}</p>
              <p className="text-xs font-medium">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Rounds', value: currentPlayer.rounds, color: 'text-emerald-400' },
          { label: 'Avg Score', value: currentPlayer.avgScore, color: 'text-blue-400' },
          { label: 'Best', value: currentPlayer.bestScore, color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-3 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Upcoming Tee Times */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Today's Tee Times</h2>
          <ChevronRight size={16} className="text-white/30" />
        </div>
        {myUpcoming.length > 0 ? myUpcoming.map(tt => {
          const course = courses.find(c => c.id === tt.courseId)
          return (
            <div key={tt.id} className="glass rounded-xl p-4 mb-3 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl">
                {course?.image}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{course?.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={12} className="text-emerald-400" />
                  <span className="text-xs text-white/50">{tt.time}</span>
                  <span className="text-xs text-white/30">•</span>
                  <span className="text-xs text-white/50">{tt.players.length}/{tt.maxPlayers} players</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-bold text-sm">{tt.price} kr</p>
              </div>
            </div>
          )
        }) : (
          <div className="glass rounded-xl p-6 text-center">
            <p className="text-4xl mb-2">⛳</p>
            <p className="text-white/40 text-sm">No tee times booked today</p>
            <p className="text-emerald-400 text-xs mt-1">Book your next round →</p>
          </div>
        )}
      </motion.div>

      {/* Course Status */}
      <motion.div variants={item} className="mt-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">Course Status</h2>
        <div className="space-y-2">
          {courses.map(c => (
            <div key={c.id} className="glass rounded-xl p-3 flex items-center gap-3">
              <span className="text-2xl">{c.image}</span>
              <div className="flex-1">
                <p className="font-medium text-sm">{c.name}</p>
                <p className="text-[10px] text-white/30">Par {c.par} • Rating {c.rating} • Slope {c.slope}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400">Open</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
