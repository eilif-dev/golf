import { motion } from 'framer-motion'
import { Wind, Droplets, Sunrise, Sunset, ChevronRight, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { weather, teeTimes, courses, currentPlayer } from '../data'

const today = new Date().toISOString().split('T')[0]
const myUpcoming = teeTimes
  .filter(t => t.date === today && t.players.includes(currentPlayer.id))
  .slice(0, 2)

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { ease: [0.25, 0.1, 0.25, 1] } } }

// Time-based greeting
const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

export default function Dashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Hero Header with gradient */}
      <div className="hero-gradient relative">
        <div className="px-5 pt-14 pb-6">
          <motion.div variants={item}>
            <p className="text-white/40 text-sm font-medium">{greeting}</p>
            <h1 className="text-3xl font-bold mt-1 tracking-tight">
              {currentPlayer.name.split(' ')[0]} <span className="inline-block ml-1">{currentPlayer.avatar}</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20">
                <span className="text-xs text-emerald-400 font-semibold">HCP {currentPlayer.handicap}</span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-white/5">
                <span className="text-xs text-white/40">{currentPlayer.rounds} rounds</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Weather Card */}
        <motion.div variants={item} className="glass-emerald rounded-2xl p-5 glow relative overflow-hidden noise">
          <div className="flex items-start justify-between mb-5 relative z-10">
            <div>
              <p className="text-emerald-400/60 text-[10px] font-semibold uppercase tracking-widest">Course Weather</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-5xl font-extralight tracking-tighter">{weather.temp}°</span>
              </div>
              <p className="text-white/40 text-sm mt-1">{weather.condition}</p>
            </div>
            <div className="text-6xl -mt-1 opacity-90">{weather.icon}</div>
          </div>
          <div className="grid grid-cols-4 gap-2 relative z-10">
            {[
              { icon: Wind, label: 'Wind', value: weather.wind },
              { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%` },
              { icon: Sunrise, label: 'Sunrise', value: weather.sunrise },
              { icon: Sunset, label: 'Sunset', value: weather.sunset },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white/[0.03] rounded-xl p-2.5 text-center">
                <Icon size={14} className="text-emerald-400/70 mx-auto mb-1.5" />
                <p className="text-[10px] text-white/25 mb-0.5">{label}</p>
                <p className="text-[11px] font-medium text-white/70">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={item} className="grid grid-cols-3 gap-3">
          {[
            { label: 'Best Round', value: currentPlayer.bestScore, sub: 'Bogstad', color: 'text-amber-400', bg: 'bg-amber-500/8' },
            { label: 'Avg Score', value: currentPlayer.avgScore, sub: 'Last 20', color: 'text-blue-400', bg: 'bg-blue-500/8' },
            { label: 'This Month', value: '4', sub: 'Rounds', color: 'text-emerald-400', bg: 'bg-emerald-500/8' },
          ].map(s => (
            <div key={s.label} className={`glass rounded-2xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{s.label}</p>
              <p className="text-[9px] text-white/15 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Today's Tee Times or CTA */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Today</h2>
            <button onClick={() => onNavigate('book')} className="text-emerald-400 text-xs font-medium flex items-center gap-1">
              All times <ChevronRight size={12} />
            </button>
          </div>
          {myUpcoming.length > 0 ? myUpcoming.map(tt => {
            const course = courses.find(c => c.id === tt.courseId)
            return (
              <motion.div
                key={tt.id}
                className="glass rounded-2xl p-4 mb-3 flex items-center gap-4"
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-2xl">
                  {course?.image}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{course?.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={11} className="text-emerald-400/70" />
                    <span className="text-xs text-white/40">{tt.time}</span>
                    <span className="text-[10px] text-white/20">•</span>
                    <span className="text-xs text-white/40">{tt.players.length}/{tt.maxPlayers}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold text-sm">{tt.price} kr</p>
                </div>
              </motion.div>
            )
          }) : (
            <motion.button
              onClick={() => onNavigate('book')}
              className="w-full glass rounded-2xl p-6 text-center group"
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-3xl mx-auto mb-3">
                ⛳
              </div>
              <p className="text-white/50 text-sm font-medium">No tee times booked</p>
              <div className="flex items-center justify-center gap-1.5 mt-2 text-emerald-400">
                <span className="text-xs font-semibold">Book your next round</span>
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.button>
          )}
        </motion.div>

        {/* Course Status */}
        <motion.div variants={item}>
          <h2 className="text-base font-semibold mb-3">Courses</h2>
          <div className="space-y-2">
            {courses.map((c, i) => (
              <motion.div
                key={c.id}
                className="glass rounded-2xl p-4 flex items-center gap-4"
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('courses')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                  {c.image}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-[10px] text-white/25 mt-0.5">Par {c.par} · {c.rating}/{c.slope}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 ping-slow" />
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">Open</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick action banner */}
        <motion.div variants={item} className="mb-4">
          <motion.button
            onClick={() => onNavigate('score')}
            className="w-full rounded-2xl p-4 flex items-center gap-4 bg-gradient-to-r from-emerald-600/20 to-emerald-500/5 border border-emerald-500/15"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Sparkles size={18} className="text-emerald-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">Start a Round</p>
              <p className="text-[11px] text-white/30">Track your score live</p>
            </div>
            <ArrowRight size={16} className="text-emerald-400/50" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
