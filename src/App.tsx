import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Home, CalendarDays, ClipboardList, Map, Trophy, User } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard'
import Booking from './pages/Booking'
import Scorecard from './pages/Scorecard'
import Courses from './pages/Courses'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'book', label: 'Book', icon: CalendarDays },
  { id: 'score', label: 'Score', icon: ClipboardList },
  { id: 'courses', label: 'Courses', icon: Map },
  { id: 'leaders', label: 'Leaders', icon: Trophy },
  { id: 'profile', label: 'Profile', icon: User },
]

const pages: Record<string, React.FC<{ onNavigate: (tab: string) => void }>> = {
  home: Dashboard,
  book: Booking,
  score: Scorecard,
  courses: Courses,
  leaders: Leaderboard,
  profile: Profile,
}

export default function App() {
  const [active, setActive] = useState('home')
  const [direction, setDirection] = useState(0)

  const navigate = useCallback((id: string) => {
    const fromIdx = tabs.findIndex(t => t.id === active)
    const toIdx = tabs.findIndex(t => t.id === id)
    setDirection(toIdx > fromIdx ? 1 : -1)
    setActive(id)
  }, [active])

  const Page = pages[active]

  return (
    <div className="min-h-screen mesh-bg text-white pb-24 max-w-lg mx-auto relative overflow-x-hidden">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(16,185,129,0.12)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            color: '#ecfdf5',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: 500,
            padding: '10px 20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 40px rgba(16,185,129,0.1)',
          },
        }}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          initial={{ opacity: 0, x: direction * 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -30 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Page onNavigate={navigate} />
        </motion.div>
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-lg mx-auto">
          {/* Fade gradient above nav */}
          <div className="h-8 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
          <div className="glass-strong px-3 pt-2.5 pb-7 rounded-t-3xl">
            <div className="flex justify-around">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = active === tab.id
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => navigate(tab.id)}
                    className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-colors relative"
                    whileTap={{ scale: 0.85 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -top-1 w-6 h-0.5 rounded-full bg-emerald-400"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <motion.div
                      animate={isActive ? { scale: 1, y: -1 } : { scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <Icon
                        size={20}
                        strokeWidth={isActive ? 2.5 : 1.5}
                        className={isActive ? 'text-emerald-400' : 'text-white/30'}
                      />
                    </motion.div>
                    <span className={`text-[10px] font-medium ${isActive ? 'text-emerald-400' : 'text-white/30'}`}>
                      {tab.label}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
