import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Users, Clock, Check, X, MapPin, CalendarCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { courses, teeTimes } from '../data'

const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r }
const formatDate = (d: Date) => d.toISOString().split('T')[0]
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface ConfirmData {
  ttId: string
  time: string
  price: number
}

export default function Booking({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [selectedCourse, setSelectedCourse] = useState(courses[0].id)
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))
  const [playerCount, setPlayerCount] = useState(2)
  const [booked, setBooked] = useState<Set<string>>(new Set())
  const [confirm, setConfirm] = useState<ConfirmData | null>(null)
  const [justBooked, setJustBooked] = useState<string | null>(null)

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i))
  const available = teeTimes.filter(t =>
    t.courseId === selectedCourse && t.date === selectedDate && t.available && !booked.has(t.id)
  )
  const course = courses.find(c => c.id === selectedCourse)!

  const handleConfirmBook = () => {
    if (!confirm) return
    setBooked(prev => new Set(prev).add(confirm.ttId))
    setJustBooked(confirm.ttId)
    setConfirm(null)
    toast.success('Tee time confirmed! ⛳')
    setTimeout(() => setJustBooked(null), 3000)
  }

  // Group times by morning/afternoon
  const morning = available.filter(t => parseInt(t.time) < 12)
  const afternoon = available.filter(t => parseInt(t.time) >= 12)

  const TimeSlot = ({ tt }: { tt: typeof available[0] }) => {
    const isBooked = booked.has(tt.id)
    const isJust = justBooked === tt.id
    const spotsLeft = tt.maxPlayers - tt.players.length
    return (
      <motion.button
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => !isBooked && setConfirm({ ttId: tt.id, time: tt.time, price: tt.price })}
        className={`rounded-2xl p-3.5 text-center transition-all relative overflow-hidden ${
          isBooked
            ? 'glass-emerald'
            : 'glass hover:border-white/10'
        }`}
      >
        {isJust && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 bg-emerald-500/15 flex items-center justify-center z-10"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring' }}>
              <Check size={28} className="text-emerald-400" strokeWidth={3} />
            </motion.div>
          </motion.div>
        )}
        <p className="text-base font-bold">{tt.time}</p>
        <div className="flex items-center justify-center gap-1 mt-1">
          <div className={`w-1.5 h-1.5 rounded-full ${spotsLeft <= 1 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          <p className="text-[10px] text-white/30">{spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'}</p>
        </div>
        <p className="text-[11px] text-emerald-400/70 font-semibold mt-1.5">{tt.price} kr</p>
      </motion.button>
    )
  }

  const TimeSection = ({ label, times }: { label: string, times: typeof available }) => {
    if (times.length === 0) return null
    return (
      <div className="mb-5">
        <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-2.5 px-1">{label}</p>
        <div className="grid grid-cols-3 gap-2">
          <AnimatePresence>{times.map(tt => <TimeSlot key={tt.id} tt={tt} />)}</AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 pt-14">
      <h1 className="text-2xl font-bold tracking-tight mb-1">Book Tee Time</h1>
      <p className="text-white/30 text-sm mb-6">Find your perfect slot</p>

      {/* Course Selection - chips */}
      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
        {courses.map(c => (
          <motion.button
            key={c.id}
            onClick={() => setSelectedCourse(c.id)}
            className={`flex-shrink-0 rounded-2xl px-4 py-2.5 flex items-center gap-2 transition-all ${
              selectedCourse === c.id
                ? 'glass-emerald text-emerald-400'
                : 'glass text-white/40'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-base">{c.image}</span>
            <span className="text-sm font-medium">{c.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Date Picker */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
        {dates.map(d => {
          const ds = formatDate(d)
          const isSelected = ds === selectedDate
          const isToday = ds === formatDate(new Date())
          const isWeekend = d.getDay() === 0 || d.getDay() === 6
          return (
            <motion.button
              key={ds}
              onClick={() => setSelectedDate(ds)}
              className={`flex-shrink-0 w-[60px] rounded-2xl py-3 text-center transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : `glass ${isWeekend ? 'text-white/50' : 'text-white/40'}`
              }`}
              whileTap={{ scale: 0.92 }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide">
                {isToday ? 'Today' : dayNames[d.getDay()]}
              </p>
              <p className="text-xl font-bold mt-0.5">{d.getDate()}</p>
              <p className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-white/20'}`}>{monthNames[d.getMonth()]}</p>
            </motion.button>
          )
        })}
      </div>

      {/* Player Count */}
      <div className="glass rounded-2xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Users size={16} className="text-emerald-400" />
          </div>
          <div>
            <span className="text-sm font-medium">Players</span>
            <p className="text-[10px] text-white/25">{playerCount === 4 ? 'Full flight' : `${4 - playerCount} spots open`}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setPlayerCount(Math.max(1, playerCount - 1))}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/40"
          >−</motion.button>
          <div className="w-10 text-center">
            <span className="text-xl font-bold">{playerCount}</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setPlayerCount(Math.min(4, playerCount + 1))}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/40"
          >+</motion.button>
        </div>
      </div>

      {/* Time Slots */}
      <TimeSection label="Morning" times={morning} />
      <TimeSection label="Afternoon" times={afternoon} />

      {available.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-4xl mb-3">🏌️</p>
          <p className="text-white/40 text-sm font-medium">Fully booked</p>
          <p className="text-white/20 text-xs mt-1">Try another date or course</p>
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirm(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-full max-w-lg bg-[#111] border border-white/10 rounded-t-3xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 rounded-full bg-white/10 mx-auto mb-5" />
              <h3 className="text-lg font-bold mb-4">Confirm Booking</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-xl">{course.image}</div>
                  <div>
                    <p className="text-sm font-semibold">{course.name}</p>
                    <p className="text-[11px] text-white/30">Par {course.par}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 glass rounded-xl p-3 flex items-center gap-2">
                    <CalendarCheck size={14} className="text-emerald-400/60" />
                    <span className="text-sm">{selectedDate}</span>
                  </div>
                  <div className="flex-1 glass rounded-xl p-3 flex items-center gap-2">
                    <Clock size={14} className="text-emerald-400/60" />
                    <span className="text-sm font-semibold">{confirm.time}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 glass rounded-xl p-3 flex items-center gap-2">
                    <Users size={14} className="text-emerald-400/60" />
                    <span className="text-sm">{playerCount} player{playerCount > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex-1 glass rounded-xl p-3 text-right">
                    <p className="text-lg font-bold text-emerald-400">{confirm.price * playerCount} kr</p>
                    <p className="text-[10px] text-white/25">{confirm.price} kr/person</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setConfirm(null)}
                  className="flex-1 glass rounded-2xl py-3.5 text-sm font-medium text-white/60"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirmBook}
                  className="flex-[2] bg-emerald-500 rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25"
                >
                  Confirm Booking
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
