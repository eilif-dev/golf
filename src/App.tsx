import { useState } from 'react'
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

const pages: Record<string, React.FC> = {
  home: Dashboard,
  book: Booking,
  score: Scorecard,
  courses: Courses,
  leaders: Leaderboard,
  profile: Profile,
}

export default function App() {
  const [active, setActive] = useState('home')

  const Page = pages[active]

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-24 max-w-lg mx-auto relative">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(16,185,129,0.15)',
            backdropFilter: 'blur(20px)',
            color: '#ecfdf5',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: 500,
          },
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <Page />
        </motion.div>
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-lg mx-auto glass-strong rounded-t-2xl px-2 pt-2 pb-6">
          <div className="flex justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = active === tab.id
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-colors relative ${
                    isActive ? 'text-emerald-400' : 'text-white/40'
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-glow"
                      className="absolute inset-0 bg-emerald-500/10 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
