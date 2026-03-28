import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Users, Clock, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { courses, teeTimes } from '../data'

const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r }
const formatDate = (d: Date) => d.toISOString().split('T')[0]
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function Booking() {
  const [selectedCourse, setSelectedCourse] = useState(courses[0].id)
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [playerCount, setPlayerCount] = useState(1)
  const [booked, setBooked] = useState<Set<string>>(new Set())

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i))
  const available = teeTimes.filter(t =>
    t.courseId === selectedCourse && t.date === selectedDate && t.available && !booked.has(t.id)
  )
  const course = courses.find(c => c.id === selectedCourse)

  const handleBook = (ttId: string) => {
    setBooked(prev => new Set(prev).add(ttId))
    setSelectedTime(ttId)
    toast.success(`Tee time booked at ${course?.name}! ⛳`, { duration: 3000 })
    setTimeout(() => setSelectedTime(null), 2000)
  }

  return (
    <div className="px-4 pt-12">
      <h1 className="text-2xl font-bold mb-1">Book Tee Time</h1>
      <p className="text-white/40 text-sm mb-6">Find and reserve your perfect slot</p>

      {/* Course Selection */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
        {courses.map(c => (
          <motion.button
            key={c.id}
            onClick={() => { setSelectedCourse(c.id); setSelectedTime(null) }}
            className={`flex-shrink-0 rounded-xl px-4 py-3 transition-all ${
              selectedCourse === c.id
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                : 'glass text-white/60'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg mr-2">{c.image}</span>
            <span className="text-sm font-medium">{c.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Date Picker */}
      <div className="mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {dates.map(d => {
            const ds = formatDate(d)
            const isSelected = ds === selectedDate
            const isToday = ds === formatDate(new Date())
            return (
              <motion.button
                key={ds}
                onClick={() => { setSelectedDate(ds); setSelectedTime(null) }}
                className={`flex-shrink-0 w-16 rounded-xl py-3 text-center transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'glass text-white/50 hover:text-white/80'
                }`}
                whileTap={{ scale: 0.92 }}
              >
                <p className="text-[10px] font-medium uppercase">
                  {isToday ? 'Today' : dayNames[d.getDay()]}
                </p>
                <p className="text-xl font-bold mt-0.5">{d.getDate()}</p>
                <p className="text-[10px] opacity-60">{monthNames[d.getMonth()]}</p>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Player Count */}
      <div className="glass rounded-xl p-4 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-emerald-400" />
          <span className="text-sm font-medium">Players</span>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setPlayerCount(Math.max(1, playerCount - 1))}
            className="w-8 h-8 rounded-full glass flex items-center justify-center text-white/60"
          >
            <ChevronLeft size={16} />
          </motion.button>
          <span className="text-lg font-bold w-6 text-center">{playerCount}</span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setPlayerCount(Math.min(4, playerCount + 1))}
            className="w-8 h-8 rounded-full glass flex items-center justify-center text-white/60"
          >
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </div>

      {/* Available Times */}
      <h3 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">
        Available Times
      </h3>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <AnimatePresence>
          {available.map(tt => {
            const isBooked = booked.has(tt.id)
            const isSelected = selectedTime === tt.id
            return (
              <motion.button
                key={tt.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => !isBooked && handleBook(tt.id)}
                className={`rounded-xl p-3 text-center transition-all relative overflow-hidden ${
                  isBooked
                    ? 'bg-emerald-500/20 border border-emerald-500/40'
                    : 'glass hover:bg-white/5'
                }`}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center"
                  >
                    <Check size={24} className="text-emerald-400" />
                  </motion.div>
                )}
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock size={12} className="text-emerald-400" />
                  <span className="text-sm font-semibold">{tt.time}</span>
                </div>
                <p className="text-[10px] text-white/30">{tt.players.length}/{tt.maxPlayers} booked</p>
                <p className="text-xs text-emerald-400 font-medium mt-1">{tt.price} kr</p>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {available.length === 0 && (
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-3xl mb-2">😔</p>
          <p className="text-white/40 text-sm">No available times for this date</p>
          <p className="text-white/20 text-xs mt-1">Try another date or course</p>
        </div>
      )}
    </div>
  )
}
